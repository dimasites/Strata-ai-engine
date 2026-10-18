#!/usr/bin/env python3
"""Extended prompt-length sweep for Strata: the same method as the original suite
(tools/strata_bench.py, the "orig" test), only the prompt lengths are widened.

    python tools/strata_bench_extended.py --url http://127.0.0.1:8081
    python tools/strata_bench_extended.py --config strata-<model>.json --port 8082

It reuses the original's calibration (words -> tokens by a two-point slope), its
word-list generator, its unique-tag fresh prompts and its 24 generated tokens per
prompt (LONG_MAX_TOKENS), and measures prompt tok/s, time to first token and decode
tok/s at nine prompt sizes:

    4K 16K 32K 64K 86K 128K 150K 184K 250K   (K = 1024 tokens)

Three fresh runs per size, medians with ranges. The largest size (250K = 256000
tokens) plus the 24 generated tokens must fit the server's context, so run it on a
context of at least 262144. The report goes to bench/results/<date>-extended-<gpu>-<model>/
in the format of docs/COMMUNITY_BENCHMARKS.md. Standard library only.
"""
from __future__ import annotations

import argparse
import datetime
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ab_engine import long_prompt                                    # noqa: E402
from strata_bench import (chat, digest, stat, fmt, collect_machine,  # noqa: E402
                          is_strata, start_server, wait_ready, stop_server,
                          redactor, gpu_slug, model_label, ROOT)

# The nine prompt sizes, in tokens (K = 1024), matching the original's 4K/16K/32K.
LENGTHS = [4096, 16384, 32768, 65536, 88064, 131072, 153600, 188416, 256000]
GEN_TOKENS = 24          # the original's LONG_MAX_TOKENS: prefill-focused, minimal decode
MARGIN = 256             # the original suite's margin (strata_bench.py): a calibrated prompt can come out longer than the target
SAFE_CTX_UNKNOWN = 32768  # the original suite's longest prompt: what to try when the server did not report its context
SCHEMA = "extended-1"


def size_label(tokens: int) -> str:
    return f"{tokens // 1024}K"


class Extended:
    def __init__(self, base, key, ctx, runs, log=print):
        self.base, self.key, self.ctx, self.runs, self.log = base, key, ctx, runs, log
        self.nonce = str(int(time.time()))
        self.tokens_per_word, self.overhead = 1.1, 40

    def tag(self, *parts) -> str:
        return "-".join([*map(str, parts), self.nonce])

    def calibrate(self):
        pts = []
        for words in (200, 800):
            r = digest(chat(self.base, self.key,
                            [{"role": "user", "content": f"[{self.tag('cal', words)}]\n" + long_prompt(words)}], 1))
            pts.append(r.get("prompt_tokens"))
        slope = (pts[1] - pts[0]) / 600 if all(pts) and pts[1] > pts[0] else None
        self.tokens_per_word = slope or 1.1
        self.overhead = max(0, (pts[0] or 0) - 200 * self.tokens_per_word) if slope else 40
        self.log(f"  calibrated: about {self.tokens_per_word:.2f} tokens per word")

    def prompt_for(self, tokens: int, run: int) -> list:
        words = max(50, int((tokens - self.overhead) / self.tokens_per_word))
        return [{"role": "user", "content": f"[ext {self.tag(run, tokens, 'p')}]\n" + long_prompt(words)}]

    def warm_up(self):
        self.log("warming up (not measured) ...")
        chat(self.base, self.key, [{"role": "user", "content": f"[{self.tag('warm')}] hi"}], 24)
        self.calibrate()
        chat(self.base, self.key, self.prompt_for(1024, -1), 8)

    def run(self) -> dict:
        self.warm_up()
        rows = []
        for tokens in LENGTHS:
            cap = self.ctx or SAFE_CTX_UNKNOWN
            if tokens + GEN_TOKENS + MARGIN > cap:
                why = f"the context is {self.ctx} tokens" if self.ctx else f"the context was not read (trying up to {SAFE_CTX_UNKNOWN} tokens)"
                self.log(f"  {size_label(tokens)} prompt: skipped ({why})")
                rows.append({"target": tokens, "label": size_label(tokens), "runs": [], "prompt_tps": None,
                             "ttft_s": None, "decode_tps": None, "prompt_tokens": None, "ok": 0})
                continue
            self.log(f"{size_label(tokens)} prompt: {self.runs} fresh prompts of about {tokens} tokens, {GEN_TOKENS} new tokens")
            run_rows = []
            for run in range(self.runs):
                d = digest(chat(self.base, self.key, self.prompt_for(tokens, run), GEN_TOKENS, timeout=3600))
                d.update(run=run, target=tokens)
                if d.get("ok"):
                    self.log(f"  run {run + 1}: {d.get('prompt_tokens')} tokens, "
                             f"prompt {d.get('prompt_tps')} tok/s, first token {d.get('ttft_s')} s")
                else:
                    self.log(f"  run {run + 1}: FAILED: {d.get('err')}")
                run_rows.append(d)
            good = [r for r in run_rows if r.get("ok")]
            rows.append({"target": tokens, "label": size_label(tokens), "runs": run_rows,
                         "prompt_tps": stat(r.get("prompt_tps") for r in good),
                         "ttft_s": stat(r.get("ttft_s") for r in good),
                         "decode_tps": stat(r.get("decode_tps") for r in good),
                         "prompt_tokens": stat(r.get("prompt_tokens") for r in good),
                         "ok": len(good)})
        return {"schema": SCHEMA, "lengths": LENGTHS, "gen_tokens": GEN_TOKENS, "rows": rows,
                "failures": [r for row in rows for x in row["runs"] if not x.get("ok")]}


def write_report(res: dict, machine: dict, parent: Path, red) -> Path:
    name = f"{res['date']}-extended-{gpu_slug(machine)}-{model_label(machine)}"
    d = parent / name
    n = 1
    while d.exists():
        n += 1
        d = parent / f"{name}-{n}"
    d.mkdir(parents=True)
    gpu = " + ".join(machine.get("gpu") or []) or "CPU only"
    vram = f"{machine['gpu_vram_mib'] / 1024:.0f} GiB VRAM" if machine.get("gpu_vram_mib") else "VRAM not read"
    model = model_label(machine) if machine.get("model") else "model not read"
    L = [f"# Extended prompt sweep on {gpu}", "",
         f"Measured on {res['date']} with `tools/strata_bench_extended.py` ({SCHEMA}, {res['runs']} runs per size, "
         f"medians with ranges). Same method as the original suite (`tools/strata_bench.py`): calibration, word-list "
         f"prompts, a unique tag per prompt (no cache help), {res['gen_tokens']} generated tokens per prompt. Speed only: "
         f"no correctness check was run.", "",
         "## Hardware and software", "",
         f"- GPU and VRAM: {gpu}, {vram}",
         f"- CPU: {machine.get('cpu') or '?'} ({machine.get('cpu_cores')} cores); installed RAM: {machine.get('ram_gib') or '?'} GiB",
         f"- OS: {machine.get('os')}; GPU driver: {machine.get('gpu_driver')}; CUDA: {machine.get('cuda')}",
         f"- Strata: project {machine.get('strata_version')}, commit {machine.get('strata_commit')}; engine {machine.get('engine_version')}",
         "",
         "## Model and configuration", "",
         f"- Model and quantization: {model}",
         f"- Context: {machine.get('context')} tokens; parallel slots: {machine.get('parallel_slots')}",
         f"- Prompt sizes: {', '.join(size_label(t) for t in res['params']['lengths'])} (K = 1024 tokens); generated tokens: {res['gen_tokens']}",
         "",
         "## Method", "",
         "Run against the HTTP API of a Strata server (started by this tool from the config, or an already running one "
         "with --url). One warm-up chat and a 1K prompt are discarded first. Each prompt is a generated word list sized "
         "by the calibration, starts with a unique tag, and is fresh every run, so the conversation cache cannot help it. "
         "Prompt tok/s is the engine's own timing; time to first token is measured by this client; decode tok/s is the "
         "engine's over the generated tokens.",
         "",
         "## Results", "",
         "| Prompt size | Actual prompt tokens | Generated tokens | Runs | Prompt tok/s median and range | TTFT seconds median and range | Decode tok/s median and range |",
         "| --- | ---: | ---: | ---: | --- | --- | --- |"]
    for row in res["results"]["rows"]:
        pt = fmt(row["prompt_tps"], 1)
        tt = fmt(row["ttft_s"], 2)
        dc = fmt(row["decode_tps"], 1)
        ptk = row["prompt_tokens"]
        ptk_s = f"{ptk['median']} ({ptk['min']}-{ptk['max']})" if ptk else "skipped"
        L.append(f"| {row['label']} | {ptk_s} | {res['gen_tokens']} cap | {row['ok']} | {pt} | {tt} | {dc} |")
    L += ["",
          "Ranges are the lowest and highest of the runs; `Runs` counts requests that returned a token.",
          "",
          "Per-request data: `results.json`.",
          ""]
    (d / "README.md").write_text(red("\n".join(L)), encoding="utf-8")
    (d / "results.json").write_text(json.dumps(redact(res, red), ensure_ascii=False, indent=1), encoding="utf-8")
    return d


def redact(obj, red):
    if isinstance(obj, dict):
        return {red(k) if isinstance(k, str) else k: redact(v, red) for k, v in obj.items()}
    if isinstance(obj, list):
        return [redact(v, red) for v in obj]
    return red(obj) if isinstance(obj, str) else obj


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Extended prompt-length sweep (see the top of this file).")
    ap.add_argument("--config", help="the model config to run (default: the newest strata-*.json of this folder)")
    ap.add_argument("--url", help="use the server already running at this address (http://127.0.0.1:8081)")
    ap.add_argument("--port", type=int, help="the port to start the server on (default: the config's)")
    ap.add_argument("--api-key", default="", help="the server's API key, if it has one")
    ap.add_argument("--runs", type=int, default=3, help="runs per prompt size (default 3)")
    ap.add_argument("--out", help="where to write the results folder (default: bench/results)")
    ap.add_argument("--ready-timeout", type=float, default=1800, help="seconds to wait for the model to load")
    ap.add_argument("--quiet", action="store_true")
    a = ap.parse_args(argv)

    cfg_path = Path(a.config) if a.config else None
    cfg = None
    if not a.url:
        if cfg_path is None:
            from strata_bench import find_configs
            found = find_configs()
            if not found:
                print("No Strata model is set up here; run setup first, or give --url of a running server.", file=sys.stderr)
                return 2
            cfg_path = found[-1]
        cfg = json.loads(cfg_path.read_text(encoding="utf-8-sig"))
    key = a.api_key or ((cfg or {}).get("api_key") or "")
    if a.url:
        base = a.url.rstrip("/")
    else:
        port = a.port or int(cfg.get("port", 8080))
        base = f"http://127.0.0.1:{port}"
    red = redactor(key=key)
    started = False
    proc = None
    try:
        if is_strata(base, key):
            print(f"Using the Strata server already running at {base}.")
        elif a.url:
            print(f"No Strata server answers at {base}.", file=sys.stderr)
            return 2
        else:
            import tempfile, os
            log_path = Path(tempfile.gettempdir()) / f"strata-extended-{os.getpid()}.log"
            print(f"Starting {cfg_path.name} on port {port} (loading takes 1-3 minutes) ...")
            proc = start_server(cfg_path, port, None, log_path)
            started = True
            if not wait_ready(base, key, proc, a.ready_timeout, print):
                print("The server did not become ready.", file=sys.stderr)
                return 1
        pre = collect_machine(base, key, cfg, None)
        ext = Extended(base, key, pre.get("context"), max(1, a.runs), log=(lambda *x: None) if a.quiet else print)
        print(f"Running the extended sweep ({len(LENGTHS)} sizes x {a.runs} runs) ...")
        out = ext.run()
        machine = collect_machine(base, key, cfg, None)
        if not machine.get("gpu"):
            machine["gpu"] = pre.get("gpu")
        res = {"schema": SCHEMA, "tool": "tools/strata_bench_extended.py",
               "date": datetime.date.today().isoformat(),
               "params": {"runs": a.runs, "lengths": LENGTHS, "gen_tokens": GEN_TOKENS},
               "machine": machine, "results": out, "runs": a.runs, "gen_tokens": GEN_TOKENS}
        parent = Path(a.out) if a.out else ROOT / "bench" / "results"
        d = write_report(res, machine, parent, red)
        print("\nExtended sweep (median, range over the runs):")
        for row in out["rows"]:
            print(f"  {row['label']:>5}: prompt {fmt(row['prompt_tps'], 1)}  TTFT {fmt(row['ttft_s'], 2)}  "
                  f"decode {fmt(row['decode_tps'], 1)}")
        print(f"\nReport: {d / 'README.md'}")
        return 1 if out["failures"] and not any(r["ok"] for r in out["rows"]) else 0
    finally:
        if started and proc is not None:
            stop_server(proc)


if __name__ == "__main__":
    sys.exit(main())
