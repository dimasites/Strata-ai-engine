# Community benchmark on NVIDIA GeForce RTX 5060 Ti + NVIDIA GeForce RTX 5060 Ti

Measured on 2026-10-14 with `tools/strata_bench.py` (suite 1, 3 runs per test, medians with ranges). Speeds are the engine's own timings; first-token times are measured by the client over HTTP. Speed only: no correctness check was run.

## Hardware and software

- GPU and VRAM: NVIDIA GeForce RTX 5060 Ti + NVIDIA GeForce RTX 5060 Ti, 32 GiB VRAM
- CPU: AMD Ryzen Threadripper 1900X 8-Core Processor (8 cores, 16 threads); installed RAM: 79.9 GiB; storage: not measured
- OS: Windows 11 (10.0.26100); GPU driver: 616.92; CUDA: not read
- Strata: project 0.1.43.1, commit not a git checkout; engine 0.1.43.1
- Background workloads and power limits: not recorded

## Model and configuration

- Model and quantization: swift-1.5-iq3_xxs
- Context: 262144 tokens; parallel slots: 1
- Settings: the install's own configuration, unchanged; thinking off for the suite; temperature 0

```text
strata.exe --pack swift-iq3_xxs --native Swift-Qwen3.8-Flash-Next-GSQ-RCO-IQ3_XXS-00001-of-00002.gguf --ple-gguf Swift-Qwen3.8-Flash-Next-GSQ-RCO-IQ3_XXS-00001-of-00002.gguf --expert-profile expert-profile.bin --expert-cache auto --prefill auto --spec 4 --mtp rt --max-context 262144 --kv int8 --kv-resident 32768 --vision --vram-reserve-mib 700 --pcie-frac 0.35 --spec-min-p 0.70 --adapt-every 1 --adapt-swaps 160 --adapt-decay 0.97
```

## Method

Run by `python tools/strata_bench.py` against the HTTP API of a Strata server (started by the benchmark from the install configuration); model loading is not timed. One warm-up chat and a 1K prompt are discarded first. Every prompt starts with a unique tag, so the conversation cache cannot help the fresh-prompt tests.

- short chat: the three questions of `tools/ab_engine.py`, up to 100 new tokens, 3 runs
- 4K / 16K prompts: generated word lists sized by a calibration request, 24 new tokens, 3 fresh prompts each
- agent session: system prompt and four tools, then 5 turns that each add about 1500 words of a project file and continue from the model's own earlier answers (the way agent clients resend a conversation), 64 new tokens per turn, 3 sessions; the cache numbers come from the answer's usage (`cached_tokens`) and timings (`prompt_n`)
- concurrency (when run): N requests sent at the same moment, total tokens over the wall time of the burst, latency over all requests

## Results

| Configuration | Actual prompt tokens | Reused tokens | Generated tokens | Runs | Prompt tok/s median and range | Decode tok/s median and range | TTFT seconds median and range |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- |
| short chat | 46 (43-51) | 0 | 100 (100-100) | 9 | not measured | 58.9 (47.7-69.0) | 0.47 (0.41-0.57) |
| 4K prompt, fresh | 4019 (4019-4019) | 0 (0-0) | 24 cap | 3 | 641.6 (352.5-644.3) | not measured | 6.30 (6.27-11.43) |
| 16K prompt, fresh | 16058 (16058-16058) | 0 (0-0) | 24 cap | 3 | 1144.1 (863.2-1147.6) | not measured | 14.08 (14.04-18.66) |
| agent session, follow-up turns | 14438 (14426-14498) at the last turn | see below | up to 64 | 3 | see below | 65.9 (49.1-88.8) | 5.58 (4.74-16.37) |

Ranges are the lowest and highest of the runs; `Runs` counts requests that returned a token.

### Agent session (conversation cache)

Cache hit over the follow-up turns: 68.6 % (68.4-68.7); earlier-turn tokens read again per session: 74 (73-145) (earlier turns that the cache did not hold; the 13634 (13633-13635) new tokens of the files are read once); first turn (nothing cached) first token: 3.52 s (3.46-5.41).

| Turn (run 1) | Prompt tokens | Reused | Read | Prompt tok/s | First token (s) | Decode tok/s |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0 | 609 | 0 | 609 | 113.4 | 5.408 | 38.1 |
| 1 | 3705 | 625 | 3080 | 188.7 | 16.372 | 52.7 |
| 2 | 5238 | 3769 | 1469 | 150.6 | 9.806 | 57.9 |
| 3 | 8682 | 5231 | 3451 | 241.6 | 14.333 | 55.9 |
| 4 | 11606 | 8745 | 2861 | 214.2 | 13.421 | 65.9 |
| 5 | 14498 | 11652 | 2846 | 268.5 | 10.655 | 50.1 |

Per-request data: `results.json`. Engine log lines from the start: `engine-log-excerpt.txt` (when this run started the server).

## Correctness and limitations

Not measured: this is a speed suite. The conversation uses the model's own replies, so token counts differ a little between runs. Machine details come from the server, `nvidia-smi`/`rocm-smi` and the OS; background load and power limits are not recorded. Total time of the suite: 256 s.
