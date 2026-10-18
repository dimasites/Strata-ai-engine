"""Tests for tools/strata_bench_extended.py: the context guard, with chat/digest mocked.
Light: no GPU, no Strata server, a few seconds."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent))
import strata_bench_extended as E  # noqa: E402


def fake_digest(r):
    return {"ok": True, "prompt_tokens": 100, "prompt_tps": 1000.0, "ttft_s": 0.1, "decode_tps": 50.0}


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


if __name__ == "__main__":
    unittest.main()
