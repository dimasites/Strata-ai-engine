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
context of at least 262144. With --parallel N each size that fits N streams is also
run as N fresh prompts sent at the same moment (the simultaneous prefill): total
prompt tok/s, per-stream tok/s, TTFT p50/p95 and the scaling against the single
stream, and while each burst runs `GET /slots` is polled once a second so the number
of slots busy at the same moment is measured. The report goes to
bench/results/<date>-extended-<gpu>-<model>/
in the format of docs/COMMUNITY_BENCHMARKS.md. Standard library only.
"""
from __future__ import annotations

import argparse
import datetime
import json
import statistics
import sys
import threading
import time
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from ab_engine import long_prompt                                    # noqa: E402
from strata_bench import (chat, digest, stat, fmt, pctl, collect_machine,  # noqa: E402
                          is_strata, start_server, wait_ready, stop_server,
                          redactor, gpu_slug, model_label, ROOT)

# The nine prompt sizes, in tokens (K = 1024), matching the original's 4K/16K/32K.
LENGTHS = [4096, 16384, 32768, 65536, 88064, 131072, 153600, 188416, 256000]
# The parallel sweep by default: the sizes a parallel batch is asked about (32K/64K/128K/250K).
PARALLEL_LENGTHS = [32768, 65536, 131072, 256000]
GEN_TOKENS = 24          # the original's LONG_MAX_TOKENS: prefill-focused, minimal decode
MARGIN = 256             # the original suite's margin (strata_bench.py): a calibrated prompt can come out longer than the target
SAFE_CTX_UNKNOWN = 32768  # the original suite's longest prompt: what to try when the server did not report its context
ETA_PREFILL_TPS = 1500   # the prefill speed the run-time estimate is made at (the plan's reference number)
SCHEMA = "extended-3"


def size_label(tokens: int) -> str:
    return f"{tokens // 1024}K"


def slot_sampler(base: str, key: str, stop, out: list, every: float = 1.0):
    """Poll `GET /slots` (one entry per slot: is_processing, n_prompt_tokens) until `stop` is set,
    appending {t, n_busy, busy, prompt_tokens} per sample. A failed poll is recorded, not fatal."""
    hdr = {"Content-Type": "application/json"}
    if key:
        hdr["Authorization"] = "Bearer " + key
    t0 = time.perf_counter()
    while not stop.is_set():
        try:
            with urllib.request.urlopen(urllib.request.Request(base + "/slots", headers=hdr), timeout=10) as r:
                slots = json.loads(r.read().decode())
            busy = [s.get("id") for s in slots if s.get("is_processing")]
            out.append({"t": round(time.perf_counter() - t0, 1), "n_busy": len(busy), "busy": busy,
                        "prompt_tokens": {s.get("id"): s.get("n_prompt_tokens") for s in slots}})
        except Exception as e:                                          # noqa: BLE001
            out.append({"t": round(time.perf_counter() - t0, 1), "err": repr(e)})
        stop.wait(every)


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


class Parallel:
    """N fresh prompts of the same size start together (a barrier): the simultaneous prefill the
    sequential sweep cannot show - total prompt tok/s, per-stream degradation, queueing on the slots.
    While the burst runs, `GET /slots` is polled once a second, so the number of slots busy at the same
    moment is measured and not inferred."""

    def __init__(self, ext: Extended, slots: int | None, n: int, runs: int, log=print):
        self.ext, self.slots, self.n, self.runs, self.log = ext, slots, max(1, n), max(1, runs), log

    def burst(self, tokens: int, run: int) -> dict:
        n = self.n
        barrier = threading.Barrier(n)
        res: dict = {}

        def one(i: int):
            msgs = self.ext.prompt_for(tokens, run * 100 + i)
            barrier.wait()
            res[i] = digest(chat(self.ext.base, self.ext.key, msgs, GEN_TOKENS, timeout=3600))

        stop = threading.Event()
        trace: list = []
        sampler = threading.Thread(target=slot_sampler,
                                   args=(self.ext.base, self.ext.key, stop, trace), daemon=True)
        th = [threading.Thread(target=one, args=(i,)) for i in range(n)]
        sampler.start()
        t0 = time.perf_counter()
        for t in th:
            t.start()
        for t in th:
            t.join()
        wall = time.perf_counter() - t0
        stop.set()
        sampler.join(timeout=5)
        good = [d for d in res.values() if d.get("ok")]
        toks = sum(d.get("prompt_tokens") or 0 for d in good)
        gen = sum(d.get("generated_tokens") or 0 for d in good)
        busy = [s.get("n_busy") for s in trace if s.get("n_busy") is not None]
        peak = max(busy) if busy else 0
        return {"round": run, "wall_s": round(wall, 2), "ok": len(good),
                "total_prompt_tps": round(toks / wall, 1) if toks and good else None,
                "total_tps": round((toks + gen) / wall, 1) if good and toks else None,
                "stream_prompt_tps": [d.get("prompt_tps") for d in good if d.get("prompt_tps") is not None],
                "ttft_s": sorted(d["ttft_s"] for d in good if d.get("ttft_s") is not None),
                "slots_busy_peak": peak,
                "slots_busy_samples": len(busy),
                "slots_busy_median": round(statistics.median(busy), 1) if busy else None,
                "slots_at_peak": [s.get("prompt_tokens") for s in trace if s.get("n_busy") == peak][:3],
                "errors": [d.get("err") for d in res.values() if d.get("err")][:3]}

    def run(self, single: dict) -> dict:
        rows = []
        for tokens in PARALLEL_LENGTHS:
            label = size_label(tokens)
            cap = self.ext.ctx or SAFE_CTX_UNKNOWN
            if self.n * (tokens + GEN_TOKENS + MARGIN) > cap:
                why = (f"the context is {self.ext.ctx} tokens for {self.n} streams"
                       if self.ext.ctx else f"the context was not read (trying up to {SAFE_CTX_UNKNOWN} tokens)")
                self.log(f"  {label} x {self.n}: skipped ({why})")
                rows.append({"target": tokens, "label": label, "streams": self.n, "ok": 0, "skipped": why})
                continue
            queued = bool(self.slots and self.n > self.slots)
            eta = round(self.n * tokens / ETA_PREFILL_TPS, 1)
            self.log(f"{label} x {self.n} streams at once, {self.runs} rounds, ETA ~{eta} s per round "
                     f"(prefill {ETA_PREFILL_TPS} tok/s)" + ("  (more streams than slots: queued)" if queued else ""))
            rounds = [self.burst(tokens, r) for r in range(self.runs)]
            good = [r for r in rounds if r["ok"] == self.n]
            for r in rounds:
                if r["errors"]:
                    self.log(f"  round {r['round'] + 1}: {r['ok']}/{self.n} ok, errors: {r['errors'][:1]}")
                elif r["ok"] == self.n:
                    self.log(f"  round {r['round'] + 1}: {rounds[0]['wall_s']} s wall, {r['total_prompt_tps']} tok/s total")
            ttft = [x for r in good for x in r["ttft_s"]]
            med = (single.get(label) or {}).get("median")
            tot = stat(r["total_prompt_tps"] for r in good)
            rows.append({"target": tokens, "label": label, "streams": self.n, "queued": queued,
                         "rounds": rounds, "ok": len(good),
                         "wall_s": stat(r["wall_s"] for r in good),
                         "total_prompt_tps": tot,
                         "total_tps": stat(r["total_tps"] for r in good),
                         "per_stream_prompt_tps": stat(x for r in good for x in r["stream_prompt_tps"]),
                          "ttft_p50_s": round(pctl(ttft, .5), 2) if ttft else None,
                          "ttft_p95_s": round(pctl(ttft, .95), 2) if ttft else None,
                          "slots_busy_peak": max((r.get("slots_busy_peak") or 0) for r in rounds),
                          "scaling": round(tot["median"] / med, 2) if tot and med else None})
        return {"schema": SCHEMA, "streams": self.n, "rows": rows,
                "failures": [e for r in rows for rd in r.get("rounds", []) for e in rd["errors"]]}


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
          f"- Prompt sizes: {', '.join(size_label(t) for t in res['params']['lengths'])} (K = 1024 tokens); generated tokens: {res['gen_tokens']}"
          + (f"; parallel streams: {res['parallel']['streams']} x {res['parallel_runs']} rounds" if res.get("parallel") else ""),
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
          ""]
    par = res.get("parallel")
    if par:
        n = par["streams"]
        L += [f"## Parallel: {n} streams at once", "",
              f"{n} fresh prompts of the same size start together (a barrier), {res['parallel_runs']} rounds, "
              f"on the parallel sizes {', '.join(r['label'] for r in par['rows'])}. "
              f"Total prompt tok/s is the sum of the prompt tokens over the wall time of the burst - the "
              f"simultaneous prefill; per-stream is the median over the streams (its drop against the "
              f"single-stream column above is the interference); scaling is the total over the single-stream "
               f"median of the same size. TTFT p50/p95 show the queueing on the slots. `Slots busy` is the highest "
               f"number of slots `GET /slots` reported processing at the same instant during the burst - the slots "
               f"measured at work, not assumed.", "",
               "| Prompt size | Streams | Wall seconds | Total prompt tok/s | Per-stream prompt tok/s | TTFT p50 / p95 s | Slots busy | Scaling × |",
               "| --- | ---: | ---: | ---: | --- | --- | ---: | ---: |"]
        for row in par["rows"]:
            if row.get("skipped"):
                L.append(f"| {row['label']} | {n} | skipped ({row['skipped']}) | | | | | | |")
                continue
            q = " (queued: more streams than slots)" if row.get("queued") else ""
            tt = (f"{row['ttft_p50_s']} / {row['ttft_p95_s']}"
                  if row["ttft_p50_s"] is not None else "not measured")
            sc = f"{row['scaling']:.2f}" if row["scaling"] is not None else "not measured"
            L.append(f"| {row['label']} | {n}{q} | {fmt(row['wall_s'], 1)} | {fmt(row['total_prompt_tps'], 1)} "
                     f"| {fmt(row['per_stream_prompt_tps'], 1)} | {tt} | {row.get('slots_busy_peak')} | {sc} |")
        L.append("")
    L += ["Per-request data: `results.json`.", ""]
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
    ap.add_argument("--gpus-used", type=int, default=None, dest="gpus_used",
                    help="how many of the PC's cards the server actually uses (for --url runs the tool cannot inspect)")
    ap.add_argument("--runs", type=int, default=3, help="runs per prompt size (default 3)")
    ap.add_argument("--parallel", type=int, default=0,
                    help="also send N fresh prompts of each size at once (the simultaneous prefill); 0 = off")
    ap.add_argument("--parallel-runs", type=int, default=None,
                    help="rounds per size in the parallel sweep; when --parallel is on and this is not given, the tool asks")
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
        pre = collect_machine(base, key, cfg, None, a.gpus_used)
        ext = Extended(base, key, pre.get("context"), max(1, a.runs), log=(lambda *x: None) if a.quiet else print)
        print(f"Running the extended sweep ({len(LENGTHS)} sizes x {a.runs} runs) ...")
        out = ext.run()
        par_out = None
        par_runs = 0
        if a.parallel > 0:
            par_runs = a.parallel_runs
            if par_runs is None:                       # the number of rounds is asked, not assumed
                try:
                    ans = input(f"Parallel runs per size (32K/64K/128K/250K x {a.parallel} streams), 2 recommended [2]: ").strip()
                    par_runs = int(ans) if ans else 2
                except (EOFError, ValueError):
                    par_runs = 2
                    print("No answer read; using 2 rounds.")
                par_runs = max(1, par_runs)
            print(f"Running the parallel sweep ({len(PARALLEL_LENGTHS)} sizes x {par_runs} rounds x {a.parallel} streams) ...")
            single = {r["label"]: r["prompt_tps"] for r in out["rows"]}
            par_out = Parallel(ext, pre.get("parallel_slots"), a.parallel, par_runs,
                               log=(lambda *x: None) if a.quiet else print).run(single)
        machine = collect_machine(base, key, cfg, None, a.gpus_used)
        if not machine.get("gpu"):
            machine["gpu"] = pre.get("gpu")
        res = {"schema": SCHEMA, "tool": "tools/strata_bench_extended.py",
               "date": datetime.date.today().isoformat(),
               "params": {"runs": a.runs, "lengths": LENGTHS, "gen_tokens": GEN_TOKENS},
               "machine": machine, "results": out, "runs": a.runs, "gen_tokens": GEN_TOKENS,
               "parallel": par_out, "parallel_runs": par_runs}
        parent = Path(a.out) if a.out else ROOT / "bench" / "results"
        d = write_report(res, machine, parent, red)
        print("\nExtended sweep (median, range over the runs):")
        for row in out["rows"]:
            print(f"  {row['label']:>5}: prompt {fmt(row['prompt_tps'], 1)}  TTFT {fmt(row['ttft_s'], 2)}  "
                  f"decode {fmt(row['decode_tps'], 1)}")
        if par_out:
            print(f"\nParallel sweep ({par_out['streams']} streams at once, median):")
            for row in par_out["rows"]:
                if row.get("skipped"):
                    continue
                print(f"  {row['label']:>5}: total {fmt(row['total_prompt_tps'], 1)}  per-stream "
                      f"{fmt(row['per_stream_prompt_tps'], 1)}  slots busy {row.get('slots_busy_peak')}  "
                      f"scaling {row['scaling']}")
        print(f"\nReport: {d / 'README.md'}")
        return 1 if out["failures"] and not any(r["ok"] for r in out["rows"]) else 0
    finally:
        if started and proc is not None:
            stop_server(proc)


if __name__ == "__main__":
    sys.exit(main())
