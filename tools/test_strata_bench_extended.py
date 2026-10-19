"""Tests for tools/strata_bench_extended.py: the context guard, with chat/digest mocked.
Light: no GPU, no Strata server, a few seconds."""
from __future__ import annotations

import json
import sys
import threading
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))
import strata_bench_extended as E  # noqa: E402


def fake_digest(r):
    return {"ok": True, "err": None, "prompt_tokens": 100, "prompt_tps": 1000.0,
            "ttft_s": 0.1, "decode_tps": 50.0, "generated_tokens": 24}


class GuardTests(unittest.TestCase):
    def run_with(self, ctx):
        with mock.patch.object(E, "chat", lambda *a, **k: {}), mock.patch.object(E, "digest", fake_digest):
            return E.Extended("http://127.0.0.1:1", "", ctx, 1, log=lambda *x: None).run()

    def test_sizes_above_the_servers_context_are_skipped_not_sent(self):
        """A prompt bigger than the context at Strata's start must never be sent: the row is kept as skipped."""
        out = self.run_with(8192)
        self.assertEqual([r["label"] for r in out["rows"]], [E.size_label(t) for t in E.LENGTHS])
        self.assertEqual({r["label"] for r in out["rows"] if r["ok"] == 0},
                         {"16K", "32K", "64K", "86K", "128K", "150K", "184K", "250K"})
        self.assertEqual([r["label"] for r in out["rows"] if r["ok"]], ["4K"])
        self.assertEqual(out["failures"], [])

    def test_an_unreadable_context_caps_at_the_originals_longest_prompt(self):
        out = self.run_with(None)
        self.assertEqual([r["label"] for r in out["rows"] if r["ok"]], ["4K", "16K"])
        self.assertEqual({r["label"] for r in out["rows"] if r["ok"] == 0},
                         {"32K", "64K", "86K", "128K", "150K", "184K", "250K"})

    def test_the_full_sweep_runs_on_a_256K_context(self):
        out = self.run_with(262144)
        self.assertEqual([r["label"] for r in out["rows"] if r["ok"]], [E.size_label(t) for t in E.LENGTHS])
        self.assertEqual(out["failures"], [])


class ParallelTests(unittest.TestCase):
    def sweep(self, ctx, n, slots=None, runs=1, single=None):
        ext = E.Extended("http://127.0.0.1:1", "", ctx, 1, log=lambda *x: None)
        with mock.patch.object(E, "chat", lambda *a, **k: {}), mock.patch.object(E, "digest", fake_digest):
            return E.Parallel(ext, slots, n, runs, log=lambda *x: None).run(single or {})

    def test_the_parallel_guard_fits_every_stream_in_the_shared_pool(self):
        """N streams share the context: 2 x 128K does not fit 262144, 2 x 64K does."""
        out = self.sweep(262144, 2)
        self.assertEqual({r["label"] for r in out["rows"] if r["ok"]}, {"32K", "64K"})
        self.assertEqual({r["label"] for r in out["rows"] if r.get("skipped")}, {"128K", "250K"})
        self.assertEqual(out["failures"], [])

    def test_more_streams_than_slots_is_marked_queued_not_failed(self):
        out = self.sweep(262144, 2, slots=1)
        rows = [r for r in out["rows"] if r["ok"]]
        self.assertTrue(rows and all(r["queued"] for r in rows))
        self.assertEqual(out["failures"], [])

    def test_totals_scaling_and_per_stream_numbers_are_computed(self):
        out = self.sweep(131072, 2, runs=1, single={"32K": {"median": 1000.0}})
        self.assertEqual([r["label"] for r in out["rows"] if r["ok"]], ["32K"])
        row = out["rows"][0]
        self.assertEqual((row["streams"], row["ok"]), (2, 1))
        self.assertIsNotNone(row["total_prompt_tps"])
        self.assertEqual(row["per_stream_prompt_tps"]["median"], 1000.0)
        self.assertEqual((row["ttft_p50_s"], row["ttft_p95_s"]), (0.1, 0.1))
        self.assertGreater(row["scaling"], 1.0)      # 2 streams of 100 tok/s in a near-zero wall

    def test_the_burst_records_how_many_slots_were_busy_at_the_same_moment(self):
        """The slot sampler runs during the burst, so the row carries the measured busy-slot peak."""
        def fake_sampler(base, key, stop, out, every=1.0):
            out.append({"t": 0.0, "n_busy": 2, "busy": [0, 1], "prompt_tokens": {0: 100, 1: 100}})
            out.append({"t": 1.0, "n_busy": 1, "busy": [0], "prompt_tokens": {0: 100, 1: 0}})
            stop.set()
        ext = E.Extended("http://127.0.0.1:1", "", 131072, 1, log=lambda *x: None)
        with mock.patch.object(E, "chat", lambda *a, **k: {}), mock.patch.object(E, "digest", fake_digest), \
                mock.patch.object(E, "slot_sampler", fake_sampler):
            out = E.Parallel(ext, 2, 2, 1, log=lambda *x: None).run({})
        row = out["rows"][0]
        self.assertEqual(row["slots_busy_peak"], 2)
        self.assertEqual(row["rounds"][0]["slots_busy_samples"], 2)

    def test_the_slot_sampler_counts_the_busy_slots_of_one_poll(self):
        body = json.dumps([{"id": 0, "is_processing": True, "n_prompt_tokens": 10},
                           {"id": 1, "is_processing": False, "n_prompt_tokens": 0}]).encode()
        stop = threading.Event()
        out: list = []

        def one_poll(req, timeout=0):
            stop.set()                      # one poll, then the sampler's loop ends
            return FakeResponse(body)

        with mock.patch.object(E.urllib.request, "urlopen", one_poll):
            E.slot_sampler("http://127.0.0.1:1", "k", stop, out, every=0.0)
        self.assertEqual(out[0]["n_busy"], 1)
        self.assertEqual(out[0]["busy"], [0])
        self.assertEqual(out[0]["prompt_tokens"], {0: 10, 1: 0})


class FakeResponse:
    def __init__(self, body):
        self.body = body

    def read(self):
        return self.body

    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


if __name__ == "__main__":
    unittest.main()
