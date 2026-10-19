#!/usr/bin/env python3
"""Slot-load sweep for Strata: N fresh prompts of the same size start together, and the server's
/slots endpoint is sampled during the burst, so a parallel slot count can be checked against work.

    python tools/strata_bench_slots.py --url http://127.0.0.1:8081 --api-key KEY --streams 4
    python tools/strata_bench_slots.py --config strata-<model>.json --streams 4 --sizes 32768,65536

The extended sweep (tools/strata_bench_extended.py --parallel N) measures the simultaneous prefill;
this tool adds the evidence that the slots are real: while the burst runs it polls `GET /slots`
(one entry per slot, `is_processing`, `n_prompt_tokens`) every second and reports how many slots
were busy at the same moment, with the prompt tokens each slot was holding. It reports, per size and
round: wall seconds, total prompt tok/s, per-stream prompt tok/s, TTFT per stream, decode tok/s per
stream, and the scaling of the total against the single-stream run of the same size.

Standard library only. Opt-in: nothing here changes a default path.
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
from strata_bench import (chat, collect_machine, digest, gpu_slug, model_label,  # noqa: E402
                          redactor, is_strata, start_server, stop_server, wait_ready, ROOT)
from strata_bench_extended import GEN_TOKENS, MARGIN, Extended, size_label  # noqa: E402

SIZES = [32768, 65536, 131072, 256000]
SCHEMA = "slots-1"


def slot_sampler(base: str, key: str, stop: threading.Event, out: list, every: float = 1.0):
    hdr = {"Content-Type": "application/json"}
    if key:
        hdr["Authorization"] = "Bearer " + key
    t0 = time.perf_counter()
    while not stop.is_set():
        try:
            with urllib.request.urlopen(urllib.request.Request(base + "/slots", headers=hdr), timeout=10) as r:
                slots = json.loads(r.read().decode())
            busy = [s.get("id") for s in slots if s.get("is_processing")]
            out.append({"t": round(time.perf_counter() - t0, 1), "busy": busy,
                        "n_busy": len(busy),
                        "prompt_tokens": {s.get("id"): s.get("n_prompt_tokens") for s in slots}})
        except Exception as e:                                          # noqa: BLE001
            out.append({"t": round(time.perf_counter() - t0, 1), "err": repr(e)})
        stop.wait(every)


class Slots:
    def __init__(self, ext: Extended, streams: int, rounds: int, log=print):
        self.ext, self.n, self.rounds, self.log = ext, max(1, streams), max(1, rounds), log

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
        sampler = threading.Thread(target=slot_sampler, args=(self.ext.base, self.ext.key, stop, trace))
        th = [threading.Thread(target=one, args=(i,)) for i in range(n)]
        sampler.start()
        t0 = time.perf_counter()
        for t in th:
            t.start()
        for t in th:
            t.join()
        wall = time.perf_counter() - t0
        stop.set()
        sampler.join()

        good = [d for d in res.values() if d.get("ok")]
        toks = sum(d.get("prompt_tokens") or 0 for d in good)
        gen = sum(d.get("generated_tokens") or 0 for d in good)
        peak = max((s.get("n_busy") or 0) for s in trace) if trace else 0
        peak_rows = [s for s in trace if (s.get("n_busy") or 0) == peak]
        return {"round": run, "wall_s": round(wall, 2), "ok": len(good),
                "total_prompt_tps": round(toks / wall, 1) if toks and good else None,
                "total_tps": round((toks + gen) / wall, 1) if good and toks else None,
                "stream_prompt_tps": [d.get("prompt_tps") for d in good if d.get("prompt_tps") is not None],
                "stream_decode_tps": [d.get("decode_tps") for d in good if d.get("decode_tps") is not None],
                "ttft_s": sorted(d["ttft_s"] for d in good if d.get("ttft_s") is not None),
                "slots_busy_peak": peak,
                "slots_busy_samples": len(trace),
                "slots_at_peak": [s.get("prompt_tokens") for s in peak_rows[:3]],
                "busy_hist": {k: sum(1 for s in trace if s.get("n_busy") == k) for k in
                              sorted({s.get("n_busy") for s in trace if s.get("n_busy") is not None})},
                "errors": [d.get("err") for d in res.values() if d.get("err")][:3]}

    def run(self, single: dict) -> dict:
        rows = []
        for tokens in self.sizes:
            label = size_label(tokens)
            cap = self.ext.ctx
            need = self.n * (tokens + GEN_TOKENS + MARGIN)
            if cap and need > cap:
                self.log(f"  {label} x {self.n}: skipped (the shared KV pool: {self.n} x "
                         f"{tokens + GEN_TOKENS + MARGIN} = {need} > {cap} tokens)")
                rows.append({"target": tokens, "label": label, "streams": self.n, "ok": 0,
                             "skipped": f"shared KV pool: {need} > {cap} tokens"})
                continue
            eta = round(tokens / 2800, 1)
            self.log(f"{label} x {self.n} streams at once, {self.rounds} rounds, ETA ~{eta} s per round")
            rounds = [self.burst(tokens, r) for r in range(self.rounds)]
            for r in rounds:
                if r["errors"]:
                    self.log(f"  round {r['round'] + 1}: {r['ok']}/{self.n} ok, errors {r['errors'][:1]}")
                else:
                    self.log(f"  round {r['round'] + 1}: wall {r['wall_s']} s, total {r['total_prompt_tps']} tok/s, "
                             f"slots busy peak {r['slots_busy_peak']}/{self.n}")
            good = [r for r in rounds if r["ok"] == self.n]
            ttft = [x for r in good for x in r["ttft_s"]]
            med = (single.get(label) or {}).get("median")
            tot = stat_of([r["total_prompt_tps"] for r in good])
            rows.append({"target": tokens, "label": label, "streams": self.n, "rounds": rounds,
                         "ok": len(good),
                         "wall_s": stat_of([r["wall_s"] for r in good]),
                         "total_prompt_tps": tot,
                         "total_tps": stat_of([r["total_tps"] for r in good]),
                         "per_stream_prompt_tps": stat_of([x for r in good for x in r["stream_prompt_tps"]]),
                         "per_stream_decode_tps": stat_of([x for r in good for x in r["stream_decode_tps"]]),
                         "ttft_p50_s": round(pctl(ttft, .5), 2) if ttft else None,
                         "ttft_p95_s": round(pctl(ttft, .95), 2) if ttft else None,
                         "slots_busy_peak": max((r["slots_busy_peak"] for r in rounds), default=0),
                         "scaling": round(tot["median"] / med, 2) if tot and med else None})
        return {"schema": SCHEMA, "streams": self.n, "rows": rows,
                "failures": [e for r in rows for rd in r.get("rounds", []) for e in rd["errors"]]}

    sizes = SIZES


def stat_of(vals):
    vals = [v for v in vals if v is not None]
    if not vals:
        return None
    return {"median": round(statistics.median(vals), 1), "min": round(min(vals), 1), "max": round(max(vals), 1)}


def pctl(v, p):
    v = sorted(v)
    if not v:
        return float("nan")
    k = (len(v) - 1) * p
    lo, hi = int(k), min(int(k) + 1, len(v) - 1)
    return v[lo] + (v[hi] - v[lo]) * (k - lo)


def fmt(s, nd):
    if not s:
        return "not measured"
    return f"{s['median']:.{nd}f} ({s['min']:.{nd}f}-{s['max']:.{nd}f})"


def single_stream_baseline(ext: Extended, sizes: list, runs: int, log) -> dict:
    out = {}
    for tokens in sizes:
        label = size_label(tokens)
        cap = ext.ctx
        if cap and tokens + GEN_TOKENS + MARGIN > cap:
            continue
        vals = []
        for run in range(runs):
            d = digest(chat(ext.base, ext.key, ext.prompt_for(tokens, 900 + run), GEN_TOKENS, timeout=3600))
            if d.get("ok"):
                vals.append(d.get("prompt_tps"))
                log(f"  baseline {label}: {d.get('prompt_tps')} tok/s")
        out[label] = stat_of(vals)
    return out


def write_report(res: dict, machine: dict, parent: Path, red) -> Path:
    slots_n = res.get("slots") or machine.get("parallel_slots") or "?"
    name = (f"{res['date']}-slots-{gpu_slug(machine)}-{model_label(machine)}"
            f"-{slots_n}slots-{res['streams']}x")
    d = parent / name
    n = 1
    while d.exists():
        n += 1
        d = parent / f"{name}-{n}"
    d.mkdir(parents=True)
    gpu = " + ".join(machine.get("gpu") or []) or "CPU only"
    vram = f"{machine['gpu_vram_mib'] / 1024:.0f} GiB VRAM" if machine.get("gpu_vram_mib") else "VRAM not read"
    model = model_label(machine) if machine.get("model") else "model not read"
    L = [f"# Slot load on {gpu} ({res['streams']} streams on {slots_n} slots)", "",
         f"Measured on {res['date']} with `tools/strata_bench_slots.py` ({SCHEMA}). {res['streams']} fresh prompts of the "
         f"same size start together (a barrier), {res['rounds']} rounds per size, {GEN_TOKENS} generated tokens each. "
         f"During every burst `GET /slots` is polled once a second, so the number of slots busy at the same moment is "
         f"measured, not inferred. Speed only: no correctness check was run.", "",
         "## Hardware and software", "",
         f"- GPU and VRAM: {gpu}, {vram}",
         f"- CPU: {machine.get('cpu') or '?'} ({machine.get('cpu_cores')} cores); installed RAM: {machine.get('ram_gib') or '?'} GiB",
         f"- OS: {machine.get('os')}; GPU driver: {machine.get('gpu_driver')}; CUDA: {machine.get('cuda')}",
         f"- Strata: project {machine.get('strata_version')}, commit {machine.get('strata_commit')}; engine {machine.get('engine_version')}",
         f"- Model: {model}; context per slot: {machine.get('context')} tokens; parallel slots: {machine.get('parallel_slots')}",
         "",
         "## Results", "",
         "| Prompt size | Streams | Wall s | Total prompt tok/s | Per-stream prompt tok/s | TTFT p50 / p95 s | Per-stream decode | Slots busy (peak) | Scaling x single |",
         "| --- | ---: | ---: | ---: | --- | --- | --- | ---: | ---: |"]
    for row in res["results"]["rows"]:
        if row.get("skipped"):
            L.append(f"| {row['label']} | {res['streams']} | skipped ({row['skipped']}) | | | | | | |")
            continue
        tt = (f"{row['ttft_p50_s']} / {row['ttft_p95_s']}" if row["ttft_p50_s"] is not None else "not measured")
        sc = f"{row['scaling']:.2f}" if row["scaling"] is not None else "not measured"
        L.append(f"| {row['label']} | {row['streams']} | {fmt(row['wall_s'], 1)} | {fmt(row['total_prompt_tps'], 1)} "
                 f"| {fmt(row['per_stream_prompt_tps'], 1)} | {tt} | {fmt(row['per_stream_decode_tps'], 1)} "
                 f"| {row['slots_busy_peak']} | {sc} |")
    L += ["",
          "`Total prompt tok/s` is the sum of the prompt tokens over the wall time of the burst. `Scaling` is that "
          "total over the single-stream median of the same size. `Slots busy (peak)` is the highest number of slots "
          "reported processing at the same instant by `GET /slots` during the burst.", "",
          "Per-round data, the slot traces and the per-stream numbers: `results.json`.", ""]
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
    ap = argparse.ArgumentParser(description="Slot-load sweep (see the top of this file).")
    ap.add_argument("--config", help="the model config to run (default: the newest strata-*.json of this folder)")
    ap.add_argument("--url", help="use the server already running at this address (http://127.0.0.1:8081)")
    ap.add_argument("--api-key", default="", help="the server's API key, if it has one")
    ap.add_argument("--gpus-used", type=int, default=None, dest="gpus_used",
                    help="how many of the PC's cards the server actually uses (for --url runs the tool cannot inspect)")
    ap.add_argument("--streams", type=int, default=0, help="how many prompts start at once (default: the server's slot count)")
    ap.add_argument("--rounds", type=int, default=2, help="rounds per size (default 2)")
    ap.add_argument("--sizes", help=f"comma separated prompt sizes (default {','.join(map(str, SIZES))})")
    ap.add_argument("--baseline-runs", type=int, default=1, help="single-stream runs per size for the scaling column (default 1)")
    ap.add_argument("--out", help="where to write the results folder (default: bench/results)")
    ap.add_argument("--ready-timeout", type=float, default=1800)
    a = ap.parse_args(argv)

    sizes = [int(x) for x in a.sizes.split(",")] if a.sizes else SIZES
    Slots.sizes = sizes

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
    base = a.url.rstrip("/") if a.url else None
    red = redactor(key=key)
    proc = None
    started = False
    try:
        if base:
            if not is_strata(base, key):
                print(f"No Strata server answers at {base}.", file=sys.stderr)
                return 2
        else:
            import tempfile, os
            port = int(cfg.get("port", 8080))
            base = f"http://127.0.0.1:{port}"
            log_path = Path(tempfile.gettempdir()) / f"strata-slots-{os.getpid()}.log"
            print(f"Starting {cfg_path.name} on port {port} (loading takes 1-3 minutes) ...")
            proc = start_server(cfg_path, port, None, log_path)
            started = True
            if not wait_ready(base, key, proc, a.ready_timeout, print):
                print("The server did not become ready.", file=sys.stderr)
                return 1
        machine = collect_machine(base, key, cfg, None, a.gpus_used)
        streams = a.streams or int(machine.get("parallel_slots") or 1)
        slots_n = int(machine.get("parallel_slots") or 1)
        ext = Extended(base, key, machine.get("context"), max(1, a.baseline_runs), log=print)
        ext.warm_up()
        print(f"Single-stream baseline ({len(sizes)} sizes x {a.baseline_runs} run) ...")
        single = single_stream_baseline(ext, sizes, a.baseline_runs, print)
        print(f"Slot load: {streams} streams at once, {len(sizes)} sizes x {a.rounds} rounds ...")
        res_results = Slots(ext, streams, a.rounds, log=print).run(single)
        machine = collect_machine(base, key, cfg, None, a.gpus_used)
        res = {"schema": SCHEMA, "tool": "tools/strata_bench_slots.py",
               "date": datetime.date.today().isoformat(),
               "params": {"sizes": sizes, "gen_tokens": GEN_TOKENS, "rounds": a.rounds,
                          "baseline_runs": a.baseline_runs},
               "machine": machine, "streams": streams, "slots": slots_n, "rounds": a.rounds,
               "layout_label": f"{slots_n} slot{'' if slots_n == 1 else 's'} × "
                               f"{streams} stream{'' if streams == 1 else 's'}",
               "baseline": single, "results": res_results}
        parent = Path(a.out) if a.out else ROOT / "bench" / "results"
        d = write_report(res, machine, parent, red)
        print(f"\nSlot load ({streams} streams at once, median):")
        for row in res_results["rows"]:
            if row.get("skipped"):
                print(f"  {row['label']:>5}: skipped ({row['skipped']})")
                continue
            print(f"  {row['label']:>5}: total {fmt(row['total_prompt_tps'], 1)}  per-stream "
                  f"{fmt(row['per_stream_prompt_tps'], 1)}  slots busy peak {row['slots_busy_peak']}/{streams}  "
                  f"scaling {row['scaling']}")
        print(f"\nReport: {d / 'README.md'}")
        return 1 if res_results["failures"] and not any(r["ok"] for r in res_results["rows"]) else 0
    finally:
        if started and proc is not None:
            stop_server(proc)


if __name__ == "__main__":
    sys.exit(main())
