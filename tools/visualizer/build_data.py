#!/usr/bin/env python3
"""Collect every bench results.json under bench/results into data.js.

Scans dated run folders (2026-*), normalizes both schemas (community suite 1
and extended-1/extended-2) into one shape, and writes data.js as a global so
the visualizer opens over file:// with no server and no CDN.

Run:  python bench/visualizer/build_data.py
"""
import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
RESULTS = HERE.parent / "results"
OUT = HERE / "data.js"


def med(block):
    if not isinstance(block, dict):
        return None
    m = block.get("median")
    if m is None:
        return None
    return {
        "median": m,
        "min": block.get("min"),
        "max": block.get("max"),
        "n": block.get("n"),
    }


def median(vals):
    vals = sorted(v for v in vals if v is not None)
    if not vals:
        return None
    n = len(vals)
    mid = n // 2
    m = vals[mid] if n % 2 else (vals[mid - 1] + vals[mid]) / 2
    return {"median": m, "min": vals[0], "max": vals[-1], "n": n}


def decode_from_requests(requests):
    return median([r.get("decode_tps") for r in requests if r.get("ok")])


def short_gpu(gpus):
    if not gpus:
        return "?"
    names = []
    for g in gpus:
        g = re.sub(r"NVIDIA GeForce ", "", g)
        g = re.sub(r"AMD Radeon ", "", g)
        names.append(g.strip())
    return " + ".join(sorted(set(names))) if len(set(names)) == 1 else " + ".join(names)


def read_note(folder):
    note = ""
    readme = folder / "README.md"
    if readme.exists():
        text = readme.read_text(encoding="utf-8", errors="replace")
        if "+75" in text and "core clock" in text:
            note = "tuned +75/+300"
        if "DIRTY" in text:
            note = (note + " / DIRTY").strip(" /")
        if "parallel slots: 2" in text:
            note = (note + " / parallel 2").strip(" /")
    return note


def point_from_row(row):
    return {
        "label": row.get("label"),
        "target": row.get("target"),
        "prompt_tps": med(row.get("prompt_tps")),
        "ttft_s": med(row.get("ttft_s")),
        "decode_tps": med(row.get("decode_tps")),
    }


def parse_community(res):
    points = []
    prompts = res.get("prompts", {})
    for label, blk in prompts.items():
        decode = med(blk.get("decode_tps")) or decode_from_requests(blk.get("requests", []))
        points.append({
            "label": label,
            "target": blk.get("target_tokens"),
            "prompt_tps": med(blk.get("prompt_tps")),
            "ttft_s": med(blk.get("ttft_s")),
            "decode_tps": decode,
        })
    chat = res.get("chat", {})
    agent = res.get("agent", {})
    return {
        "points": points,
        "chat": {
            "decode_tps": med(chat.get("decode_tps")),
            "ttft_s": med(chat.get("ttft_s")),
        },
        "agent": {
            "decode_tps": med(agent.get("turn_decode_tps")),
            "ttft_s": med(agent.get("turn_ttft_s")) or med(agent.get("first_turn_ttft_s")),
            "cache_hit_pct": med(agent.get("hit_pct")) or med(agent.get("cache_hit_pct")),
        },
    }


def parse_extended(res):
    rows = res.get("rows", [])
    points = [point_from_row(r) for r in rows]
    return {"points": points, "chat": {}, "agent": {}}


def parse_slots(doc, res):
    streams = doc.get("streams") or res.get("streams")
    points = []
    for row in res.get("rows", []):
        points.append({
            "label": row.get("label"),
            "target": row.get("target"),
            "prompt_tps": med(row.get("per_stream_prompt_tps")),
            "ttft_s": {"median": row.get("ttft_p50_s"), "min": None,
                       "max": row.get("ttft_p95_s"), "n": None},
            "decode_tps": med(row.get("per_stream_decode_tps")),
            "total_prompt_tps": med(row.get("total_prompt_tps")),
            "scaling": row.get("scaling"),
        })
    return {"points": points, "chat": {}, "agent": {}, "streams": streams}


def layout_label(machine, streams):
    p = machine.get("parallel_slots") or 1
    s = streams or 1
    return f"{p} slot{'' if p == 1 else 's'} × {s} stream{'' if s == 1 else 's'}"


def keep_run(machine):
    ctx = machine.get("context")
    gpus = machine.get("gpu") or []
    is_2x5060 = len(gpus) == 2 and all("5060 Ti" in g for g in gpus)
    if ctx is None:
        return False
    if ctx >= 262144:
        return True
    return is_2x5060


def collect():
    runs = []
    for folder in sorted(RESULTS.iterdir()):
        if not folder.is_dir():
            continue
        if not re.match(r"^\d{4}-", folder.name):
            continue
        rf = folder / "results.json"
        if not rf.exists():
            continue
        try:
            doc = json.loads(rf.read_text(encoding="utf-8", errors="replace"))
        except Exception as exc:
            print(f"skip {folder.name}: {exc}")
            continue
        if not isinstance(doc, dict):
            print(f"skip {folder.name}: not an object")
            continue
        machine = doc.get("machine", {})
        res = doc.get("results", {})
        if not isinstance(machine, dict) or not isinstance(res, dict):
            print(f"skip {folder.name}: bad machine/results")
            continue
        if not keep_run(machine):
            print(f"skip {folder.name}: shallow context ({machine.get('context')})")
            continue
        schema = doc.get("schema")
        if isinstance(schema, str) and schema.startswith("extended"):
            kind = "extended"
            parsed = parse_extended(res)
        elif isinstance(schema, str) and schema.startswith("slots"):
            kind = "slots"
            parsed = parse_slots(doc, res)
        else:
            kind = "community"
            parsed = parse_community(res)
        if not parsed["points"] and not parsed.get("chat"):
            print(f"skip {folder.name}: no data")
            continue
        gpus = machine.get("gpu", [])
        note = read_note(folder)
        if kind == "slots":
            note = re.sub(r"\s*/?\s*parallel \d+", "", note).strip(" /")
        m = re.search(r"(?:iq\d[_a-z]*|model)(.*)$", folder.name)
        tag = m.group(1).strip("-") if m else ""
        runs.append({
            "id": folder.name,
            "tag": tag,
            "date": doc.get("date"),
            "kind": kind,
            "model": machine.get("model"),
            "gpu": gpus,
            "gpu_label": short_gpu(gpus),
            "vram_mib": machine.get("gpu_vram_mib"),
            "gpus_used": machine.get("gpus_used"),
            "gpus_host": machine.get("gpus_host") or len(gpus),
            "cpu": machine.get("cpu"),
            "context": machine.get("context"),
            "parallel": machine.get("parallel_slots"),
            "commit": machine.get("strata_commit"),
            "expert_slots": (machine.get("engine_info") or {}).get("expert_slots"),
            "note": note,
            "streams": parsed.get("streams") or 1,
            "layout": doc.get("layout_label") or layout_label(machine, parsed.get("streams")),
            "points": parsed["points"],
            "chat": parsed.get("chat", {}),
            "agent": parsed.get("agent", {}),
        })
    return runs


def main():
    runs = collect()
    payload = json.dumps({"generated_from": "bench/results", "runs": runs},
                         ensure_ascii=False, indent=1)
    OUT.write_text("window.BENCH_DATA = " + payload + ";\n", encoding="utf-8")
    print(f"wrote {OUT} with {len(runs)} runs")
    for r in runs:
        print(f"  {r['id']}  {r['kind']}  {r['gpu_label']}  ctx={r['context']}  p{r['parallel']}  {r['note']}")


if __name__ == "__main__":
    main()
