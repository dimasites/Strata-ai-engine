window.BENCH_DATA = {
 "generated_from": "bench/results",
 "runs": [
  {
   "id": "2026-10-14-community-2x-rtx-5060-ti-swift-1-5-iq3-xxs",
   "tag": "xxs",
   "date": "2026-10-14",
   "kind": "community",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 5060 Ti",
    "NVIDIA GeForce RTX 5060 Ti"
   ],
   "gpu_label": "RTX 5060 Ti",
   "vram_mib": 32622,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "AMD Ryzen Threadripper 1900X 8-Core Processor",
   "context": 262144,
   "parallel": 1,
   "commit": null,
   "expert_slots": 11267,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 641.6,
      "min": 352.5,
      "max": 644.3,
      "n": 3
     },
     "ttft_s": {
      "median": 6.299,
      "min": 6.266,
      "max": 11.432,
      "n": 3
     },
     "decode_tps": {
      "median": 44.1,
      "min": 43.1,
      "max": 63.1,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1144.1,
      "min": 863.2,
      "max": 1147.6,
      "n": 3
     },
     "ttft_s": {
      "median": 14.08,
      "min": 14.037,
      "max": 18.662,
      "n": 3
     },
     "decode_tps": {
      "median": 64.8,
      "min": 63.6,
      "max": 67.3,
      "n": 3
     }
    }
   ],
   "chat": {
    "decode_tps": {
     "median": 58.9,
     "min": 47.7,
     "max": 69.0,
     "n": 9
    },
    "ttft_s": {
     "median": 0.465,
     "min": 0.407,
     "max": 0.571,
     "n": 9
    }
   },
   "agent": {
    "decode_tps": {
     "median": 65.9,
     "min": 49.1,
     "max": 88.8,
     "n": 15
    },
    "ttft_s": {
     "median": 5.585,
     "min": 4.738,
     "max": 16.372,
     "n": 15
    },
    "cache_hit_pct": {
     "median": 68.593,
     "min": 68.387,
     "max": 68.655,
     "n": 3
    }
   }
  },
  {
   "id": "2026-10-17-community-2x-rtx-5060-ti-swift-1-5-iq3-xxs",
   "tag": "xxs",
   "date": "2026-10-17",
   "kind": "community",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 5060 Ti",
    "NVIDIA GeForce RTX 5060 Ti"
   ],
   "gpu_label": "RTX 5060 Ti",
   "vram_mib": 32622,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "AMD Ryzen Threadripper 1900X 8-Core Processor",
   "context": 262144,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 11262,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 686.0,
      "min": 684.5,
      "max": 686.5,
      "n": 3
     },
     "ttft_s": {
      "median": 5.907,
      "min": 5.901,
      "max": 5.915,
      "n": 3
     },
     "decode_tps": {
      "median": 65.4,
      "min": 55.8,
      "max": 67.5,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1261.2,
      "min": 1256.4,
      "max": 1263.1,
      "n": 3
     },
     "ttft_s": {
      "median": 12.798,
      "min": 12.767,
      "max": 12.846,
      "n": 3
     },
     "decode_tps": {
      "median": 77.4,
      "min": 77.3,
      "max": 79.0,
      "n": 3
     }
    }
   ],
   "chat": {
    "decode_tps": {
     "median": 69.3,
     "min": 57.1,
     "max": 76.9,
     "n": 9
    },
    "ttft_s": {
     "median": 0.428,
     "min": 0.374,
     "max": 0.575,
     "n": 9
    }
   },
   "agent": {
    "decode_tps": {
     "median": 78.9,
     "min": 56.9,
     "max": 95.4,
     "n": 15
    },
    "ttft_s": {
     "median": 5.269,
     "min": 4.559,
     "max": 5.511,
     "n": 15
    },
    "cache_hit_pct": {
     "median": 68.614,
     "min": 68.55,
     "max": 68.725,
     "n": 3
    }
   }
  },
  {
   "id": "2026-10-17-community-2x-rtx-5060-ti-swift-1-5-iq3-xxs-2",
   "tag": "xxs-2",
   "date": "2026-10-17",
   "kind": "community",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 5060 Ti",
    "NVIDIA GeForce RTX 5060 Ti"
   ],
   "gpu_label": "RTX 5060 Ti",
   "vram_mib": 32622,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 65536,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 10906,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1169.0,
      "min": 1161.2,
      "max": 1171.6,
      "n": 3
     },
     "ttft_s": {
      "median": 3.464,
      "min": 3.459,
      "max": 3.481,
      "n": 3
     },
     "decode_tps": {
      "median": 74.0,
      "min": 66.4,
      "max": 76.4,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1836.2,
      "min": 1830.2,
      "max": 1844.2,
      "n": 3
     },
     "ttft_s": {
      "median": 8.779,
      "min": 8.742,
      "max": 8.807,
      "n": 3
     },
     "decode_tps": {
      "median": 64.3,
      "min": 63.0,
      "max": 67.5,
      "n": 3
     }
    }
   ],
   "chat": {
    "decode_tps": {
     "median": 89.5,
     "min": 68.4,
     "max": 108.1,
     "n": 9
    },
    "ttft_s": {
     "median": 0.362,
     "min": 0.301,
     "max": 0.414,
     "n": 9
    }
   },
   "agent": {
    "decode_tps": {
     "median": 90.3,
     "min": 65.6,
     "max": 105.7,
     "n": 15
    },
    "ttft_s": {
     "median": 2.873,
     "min": 2.11,
     "max": 3.169,
     "n": 15
    },
    "cache_hit_pct": {
     "median": 68.717,
     "min": 68.445,
     "max": 68.742,
     "n": 3
    }
   }
  },
  {
   "id": "2026-10-17-community-2x-rtx-5060-ti-swift-1-5-iq3-xxs-3",
   "tag": "xxs-3",
   "date": "2026-10-17",
   "kind": "community",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 5060 Ti",
    "NVIDIA GeForce RTX 5060 Ti"
   ],
   "gpu_label": "RTX 5060 Ti",
   "vram_mib": 32622,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 9083,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1140.2,
      "min": 1118.8,
      "max": 1141.0,
      "n": 3
     },
     "ttft_s": {
      "median": 3.561,
      "min": 3.546,
      "max": 3.632,
      "n": 3
     },
     "decode_tps": {
      "median": 72.3,
      "min": 64.6,
      "max": 76.4,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1822.2,
      "min": 1811.2,
      "max": 1835.7,
      "n": 3
     },
     "ttft_s": {
      "median": 8.847,
      "min": 8.797,
      "max": 8.927,
      "n": 3
     },
     "decode_tps": {
      "median": 60.9,
      "min": 59.8,
      "max": 61.4,
      "n": 3
     }
    }
   ],
   "chat": {
    "decode_tps": {
     "median": 83.2,
     "min": 72.7,
     "max": 97.6,
     "n": 9
    },
    "ttft_s": {
     "median": 0.416,
     "min": 0.342,
     "max": 0.453,
     "n": 9
    }
   },
   "agent": {
    "decode_tps": {
     "median": 92.7,
     "min": 66.0,
     "max": 107.5,
     "n": 15
    },
    "ttft_s": {
     "median": 2.973,
     "min": 2.208,
     "max": 3.235,
     "n": 15
    },
    "cache_hit_pct": {
     "median": 68.768,
     "min": 68.444,
     "max": 68.785,
     "n": 3
    }
   }
  },
  {
   "id": "2026-10-17-community-rtx-5060-ti-plus-rtx-3090-swift-1-5-iq3-xxs-parallel1",
   "tag": "xxs-parallel1",
   "date": "2026-10-17",
   "kind": "community",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 5060 Ti",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 5060 Ti + RTX 3090",
   "vram_mib": 40887,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 10202,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1201.1,
      "min": 1193.6,
      "max": 1201.7,
      "n": 3
     },
     "ttft_s": {
      "median": 3.387,
      "min": 3.366,
      "max": 3.387,
      "n": 3
     },
     "decode_tps": {
      "median": 74.6,
      "min": 58.6,
      "max": 89.2,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1495.2,
      "min": 1492.9,
      "max": 1509.3,
      "n": 3
     },
     "ttft_s": {
      "median": 10.798,
      "min": 10.701,
      "max": 10.81,
      "n": 3
     },
     "decode_tps": {
      "median": 70.0,
      "min": 68.4,
      "max": 70.0,
      "n": 3
     }
    }
   ],
   "chat": {
    "decode_tps": {
     "median": 79.1,
     "min": 67.1,
     "max": 97.5,
     "n": 9
    },
    "ttft_s": {
     "median": 0.369,
     "min": 0.33,
     "max": 0.428,
     "n": 9
    }
   },
   "agent": {
    "decode_tps": {
     "median": 94.8,
     "min": 73.9,
     "max": 118.9,
     "n": 15
    },
    "ttft_s": {
     "median": 3.034,
     "min": 2.602,
     "max": 3.214,
     "n": 15
    },
    "cache_hit_pct": {
     "median": 68.708,
     "min": 68.47,
     "max": 68.739,
     "n": 3
    }
   }
  },
  {
   "id": "2026-10-17-community-rtx-5060-ti-plus-rtx-3090-swift-1-5-iq3-xxs-parallel2",
   "tag": "xxs-parallel2",
   "date": "2026-10-17",
   "kind": "community",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 5060 Ti",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 5060 Ti + RTX 3090",
   "vram_mib": 40887,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 2,
   "commit": "6dc36961",
   "expert_slots": 6065,
   "note": "parallel 2",
   "streams": 1,
   "layout": "2 slots × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1000.2,
      "min": 999.6,
      "max": 1001.6,
      "n": 3
     },
     "ttft_s": {
      "median": 4.051,
      "min": 4.042,
      "max": 4.057,
      "n": 3
     },
     "decode_tps": {
      "median": 44.9,
      "min": 34.2,
      "max": 57.4,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1283.7,
      "min": 1280.9,
      "max": 1288.2,
      "n": 3
     },
     "ttft_s": {
      "median": 12.559,
      "min": 12.539,
      "max": 12.617,
      "n": 3
     },
     "decode_tps": {
      "median": 53.5,
      "min": 51.1,
      "max": 58.2,
      "n": 3
     }
    }
   ],
   "chat": {
    "decode_tps": {
     "median": 46.4,
     "min": 36.8,
     "max": 51.9,
     "n": 9
    },
    "ttft_s": {
     "median": 0.795,
     "min": 0.691,
     "max": 0.861,
     "n": 9
    }
   },
   "agent": {
    "decode_tps": {
     "median": 55.7,
     "min": 41.7,
     "max": 67.1,
     "n": 15
    },
    "ttft_s": {
     "median": 3.617,
     "min": 3.228,
     "max": 3.807,
     "n": 15
    },
    "cache_hit_pct": {
     "median": 68.699,
     "min": 68.459,
     "max": 68.776,
     "n": 3
    }
   }
  },
  {
   "id": "2026-10-18-extended-2x-rtx-3090-swift-1.5-iq3_xxs",
   "tag": "",
   "date": "2026-10-18",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 15694,
   "note": "DIRTY",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1364.9,
      "min": 1360.9,
      "max": 1370.4,
      "n": 3
     },
     "ttft_s": {
      "median": 2.969,
      "min": 2.951,
      "max": 2.992,
      "n": 3
     },
     "decode_tps": {
      "median": 83.2,
      "min": 76.8,
      "max": 84.1,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2196.6,
      "min": 2189.9,
      "max": 2197.2,
      "n": 3
     },
     "ttft_s": {
      "median": 7.348,
      "min": 7.337,
      "max": 7.398,
      "n": 3
     },
     "decode_tps": {
      "median": 89.8,
      "min": 84.4,
      "max": 92.4,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2739.4,
      "min": 2727.8,
      "max": 2754.3,
      "n": 3
     },
     "ttft_s": {
      "median": 11.775,
      "min": 11.686,
      "max": 11.786,
      "n": 3
     },
     "decode_tps": {
      "median": 86.3,
      "min": 85.0,
      "max": 87.8,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 3046.3,
      "min": 2971.8,
      "max": 3083.3,
      "n": 3
     },
     "ttft_s": {
      "median": 21.1,
      "min": 20.845,
      "max": 21.604,
      "n": 3
     },
     "decode_tps": {
      "median": 88.6,
      "min": 82.4,
      "max": 99.3,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 3120.5,
      "min": 3119.5,
      "max": 3129.0,
      "n": 3
     },
     "ttft_s": {
      "median": 27.675,
      "min": 27.602,
      "max": 27.708,
      "n": 3
     },
     "decode_tps": {
      "median": 82.9,
      "min": 80.3,
      "max": 84.2,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 3148.2,
      "min": 3119.5,
      "max": 3174.6,
      "n": 3
     },
     "ttft_s": {
      "median": 40.757,
      "min": 40.433,
      "max": 41.149,
      "n": 3
     },
     "decode_tps": {
      "median": 74.3,
      "min": 73.5,
      "max": 89.1,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 3139.5,
      "min": 3130.5,
      "max": 3157.4,
      "n": 3
     },
     "ttft_s": {
      "median": 47.882,
      "min": 47.592,
      "max": 48.006,
      "n": 3
     },
     "decode_tps": {
      "median": 72.4,
      "min": 66.9,
      "max": 74.7,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 3156.5,
      "min": 3128.4,
      "max": 3159.2,
      "n": 3
     },
     "ttft_s": {
      "median": 58.38,
      "min": 58.342,
      "max": 58.914,
      "n": 3
     },
     "decode_tps": {
      "median": 80.7,
      "min": 79.8,
      "max": 93.3,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 3011.1,
      "min": 2993.0,
      "max": 3117.7,
      "n": 3
     },
     "ttft_s": {
      "median": 83.102,
      "min": 80.283,
      "max": 83.613,
      "n": 3
     },
     "decode_tps": {
      "median": 75.8,
      "min": 75.7,
      "max": 77.1,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-18-extended-2x-rtx-3090-swift-1.5-iq3_xxs-2",
   "tag": "2",
   "date": "2026-10-18",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 18950,
   "note": "tuned +75/+300",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1633.0,
      "min": 1608.4,
      "max": 1633.5,
      "n": 3
     },
     "ttft_s": {
      "median": 2.503,
      "min": 2.478,
      "max": 2.538,
      "n": 3
     },
     "decode_tps": {
      "median": 107.1,
      "min": 84.7,
      "max": 124.1,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2526.9,
      "min": 2492.9,
      "max": 2580.0,
      "n": 3
     },
     "ttft_s": {
      "median": 6.399,
      "min": 6.249,
      "max": 6.49,
      "n": 3
     },
     "decode_tps": {
      "median": 92.7,
      "min": 91.4,
      "max": 97.9,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 3174.7,
      "min": 3169.0,
      "max": 3179.5,
      "n": 3
     },
     "ttft_s": {
      "median": 10.146,
      "min": 10.127,
      "max": 10.147,
      "n": 3
     },
     "decode_tps": {
      "median": 89.5,
      "min": 84.1,
      "max": 103.8,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 3682.6,
      "min": 3673.4,
      "max": 3724.9,
      "n": 3
     },
     "ttft_s": {
      "median": 17.472,
      "min": 17.247,
      "max": 17.501,
      "n": 3
     },
     "decode_tps": {
      "median": 88.1,
      "min": 81.9,
      "max": 92.4,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 3845.4,
      "min": 3739.6,
      "max": 3866.5,
      "n": 3
     },
     "ttft_s": {
      "median": 22.476,
      "min": 22.346,
      "max": 23.1,
      "n": 3
     },
     "decode_tps": {
      "median": 84.2,
      "min": 82.7,
      "max": 92.2,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 3974.4,
      "min": 3970.3,
      "max": 3974.8,
      "n": 3
     },
     "ttft_s": {
      "median": 32.316,
      "min": 32.309,
      "max": 32.347,
      "n": 3
     },
     "decode_tps": {
      "median": 84.5,
      "min": 79.3,
      "max": 94.5,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 3968.8,
      "min": 3966.1,
      "max": 3987.6,
      "n": 3
     },
     "ttft_s": {
      "median": 37.902,
      "min": 37.712,
      "max": 37.925,
      "n": 3
     },
     "decode_tps": {
      "median": 84.2,
      "min": 73.7,
      "max": 93.2,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 3989.1,
      "min": 3963.9,
      "max": 3992.2,
      "n": 3
     },
     "ttft_s": {
      "median": 46.227,
      "min": 46.193,
      "max": 46.511,
      "n": 3
     },
     "decode_tps": {
      "median": 79.0,
      "min": 61.5,
      "max": 85.3,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 3957.7,
      "min": 3955.7,
      "max": 3963.5,
      "n": 3
     },
     "ttft_s": {
      "median": 63.292,
      "min": 63.207,
      "max": 63.33,
      "n": 3
     },
     "decode_tps": {
      "median": 86.5,
      "min": 78.9,
      "max": 102.3,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-18-extended-2x-rtx-3090-swift-1.5-iq3_xxs-3",
   "tag": "3",
   "date": "2026-10-18",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 2,
   "commit": "6dc36961",
   "expert_slots": 14332,
   "note": "tuned +75/+300 / parallel 2",
   "streams": 1,
   "layout": "2 slots × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1343.7,
      "min": 1341.6,
      "max": 1344.0,
      "n": 3
     },
     "ttft_s": {
      "median": 3.03,
      "min": 3.022,
      "max": 3.038,
      "n": 3
     },
     "decode_tps": {
      "median": 85.5,
      "min": 69.6,
      "max": 90.8,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2213.4,
      "min": 2183.5,
      "max": 2225.1,
      "n": 3
     },
     "ttft_s": {
      "median": 7.299,
      "min": 7.242,
      "max": 7.396,
      "n": 3
     },
     "decode_tps": {
      "median": 94.1,
      "min": 90.0,
      "max": 96.4,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2699.5,
      "min": 2681.2,
      "max": 2704.0,
      "n": 3
     },
     "ttft_s": {
      "median": 11.922,
      "min": 11.906,
      "max": 12.009,
      "n": 3
     },
     "decode_tps": {
      "median": 85.8,
      "min": 84.0,
      "max": 97.4,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 3143.4,
      "min": 3137.3,
      "max": 3145.7,
      "n": 3
     },
     "ttft_s": {
      "median": 20.427,
      "min": 20.412,
      "max": 20.478,
      "n": 3
     },
     "decode_tps": {
      "median": 89.1,
      "min": 82.1,
      "max": 99.5,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 3204.9,
      "min": 3189.6,
      "max": 3215.3,
      "n": 3
     },
     "ttft_s": {
      "median": 26.951,
      "min": 26.857,
      "max": 27.081,
      "n": 3
     },
     "decode_tps": {
      "median": 83.9,
      "min": 68.1,
      "max": 86.3,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 3319.4,
      "min": 3308.3,
      "max": 3346.7,
      "n": 3
     },
     "ttft_s": {
      "median": 38.656,
      "min": 38.336,
      "max": 38.78,
      "n": 3
     },
     "decode_tps": {
      "median": 77.3,
      "min": 71.9,
      "max": 78.2,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 3197.1,
      "min": 3010.4,
      "max": 3218.4,
      "n": 3
     },
     "ttft_s": {
      "median": 47.014,
      "min": 46.696,
      "max": 49.917,
      "n": 3
     },
     "decode_tps": {
      "median": 87.2,
      "min": 80.4,
      "max": 87.9,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 3347.7,
      "min": 3337.1,
      "max": 3360.5,
      "n": 3
     },
     "ttft_s": {
      "median": 55.064,
      "min": 54.847,
      "max": 55.217,
      "n": 3
     },
     "decode_tps": {
      "median": 78.5,
      "min": 70.9,
      "max": 84.4,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 3317.0,
      "min": 3285.8,
      "max": 3321.1,
      "n": 3
     },
     "ttft_s": {
      "median": 75.481,
      "min": 75.368,
      "max": 76.194,
      "n": 3
     },
     "decode_tps": {
      "median": 80.7,
      "min": 44.1,
      "max": 87.8,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-18-extended-2x-rtx-3090-swift-1.5-iq3_xxs-4",
   "tag": "4",
   "date": "2026-10-18",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 3,
   "commit": "477c1dc2",
   "expert_slots": 12029,
   "note": "tuned +75/+300",
   "streams": 1,
   "layout": "3 slots × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1226.1,
      "min": 1220.9,
      "max": 1227.9,
      "n": 3
     },
     "ttft_s": {
      "median": 3.311,
      "min": 3.31,
      "max": 3.316,
      "n": 3
     },
     "decode_tps": {
      "median": 73.3,
      "min": 64.0,
      "max": 82.7,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2061.0,
      "min": 2057.4,
      "max": 2063.2,
      "n": 3
     },
     "ttft_s": {
      "median": 7.833,
      "min": 7.819,
      "max": 7.842,
      "n": 3
     },
     "decode_tps": {
      "median": 79.3,
      "min": 78.3,
      "max": 81.6,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2472.5,
      "min": 2463.3,
      "max": 2488.1,
      "n": 3
     },
     "ttft_s": {
      "median": 13.009,
      "min": 12.92,
      "max": 13.072,
      "n": 3
     },
     "decode_tps": {
      "median": 79.8,
      "min": 62.1,
      "max": 90.0,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2828.3,
      "min": 2827.1,
      "max": 2860.3,
      "n": 3
     },
     "ttft_s": {
      "median": 22.71,
      "min": 22.443,
      "max": 22.72,
      "n": 3
     },
     "decode_tps": {
      "median": 85.5,
      "min": 84.4,
      "max": 93.4,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 2727.1,
      "min": 2723.6,
      "max": 2733.9,
      "n": 3
     },
     "ttft_s": {
      "median": 31.653,
      "min": 31.559,
      "max": 31.689,
      "n": 3
     },
     "decode_tps": {
      "median": 95.1,
      "min": 86.2,
      "max": 98.7,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 2914.5,
      "min": 2907.6,
      "max": 2915.9,
      "n": 3
     },
     "ttft_s": {
      "median": 44.018,
      "min": 43.985,
      "max": 44.111,
      "n": 3
     },
     "decode_tps": {
      "median": 80.3,
      "min": 79.3,
      "max": 82.7,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 2790.0,
      "min": 2778.6,
      "max": 2790.3,
      "n": 3
     },
     "ttft_s": {
      "median": 53.856,
      "min": 53.837,
      "max": 54.078,
      "n": 3
     },
     "decode_tps": {
      "median": 77.7,
      "min": 75.2,
      "max": 81.1,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 2830.4,
      "min": 2822.3,
      "max": 2836.7,
      "n": 3
     },
     "ttft_s": {
      "median": 65.103,
      "min": 64.951,
      "max": 65.291,
      "n": 3
     },
     "decode_tps": {
      "median": 87.6,
      "min": 87.2,
      "max": 95.5,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 2803.0,
      "min": 2798.0,
      "max": 2824.2,
      "n": 3
     },
     "ttft_s": {
      "median": 89.271,
      "min": 88.615,
      "max": 89.441,
      "n": 3
     },
     "decode_tps": {
      "median": 82.8,
      "min": 74.7,
      "max": 90.5,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-18-extended-2x-rtx-3090-swift-1.5-iq3_xxs-5",
   "tag": "5",
   "date": "2026-10-18",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 4,
   "commit": "477c1dc2",
   "expert_slots": 9732,
   "note": "tuned +75/+300",
   "streams": 1,
   "layout": "4 slots × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1096.9,
      "min": 1057.3,
      "max": 1111.7,
      "n": 3
     },
     "ttft_s": {
      "median": 3.685,
      "min": 3.65,
      "max": 3.826,
      "n": 3
     },
     "decode_tps": {
      "median": 49.1,
      "min": 44.7,
      "max": 53.0,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1896.0,
      "min": 1880.5,
      "max": 1920.7,
      "n": 3
     },
     "ttft_s": {
      "median": 8.519,
      "min": 8.404,
      "max": 8.57,
      "n": 3
     },
     "decode_tps": {
      "median": 67.3,
      "min": 60.3,
      "max": 90.2,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2304.1,
      "min": 2298.5,
      "max": 2318.6,
      "n": 3
     },
     "ttft_s": {
      "median": 13.962,
      "min": 13.879,
      "max": 14.004,
      "n": 3
     },
     "decode_tps": {
      "median": 79.7,
      "min": 71.4,
      "max": 84.4,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2658.2,
      "min": 2643.2,
      "max": 2666.7,
      "n": 3
     },
     "ttft_s": {
      "median": 24.163,
      "min": 24.083,
      "max": 24.3,
      "n": 3
     },
     "decode_tps": {
      "median": 83.2,
      "min": 78.9,
      "max": 83.9,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 2693.8,
      "min": 2683.2,
      "max": 2707.1,
      "n": 3
     },
     "ttft_s": {
      "median": 32.044,
      "min": 31.891,
      "max": 32.166,
      "n": 3
     },
     "decode_tps": {
      "median": 83.6,
      "min": 74.8,
      "max": 92.5,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 2828.5,
      "min": 2801.1,
      "max": 2848.6,
      "n": 3
     },
     "ttft_s": {
      "median": 45.359,
      "min": 45.043,
      "max": 45.803,
      "n": 3
     },
     "decode_tps": {
      "median": 78.0,
      "min": 73.4,
      "max": 83.2,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 2833.7,
      "min": 2773.5,
      "max": 2840.7,
      "n": 3
     },
     "ttft_s": {
      "median": 53.034,
      "min": 52.876,
      "max": 54.176,
      "n": 3
     },
     "decode_tps": {
      "median": 85.7,
      "min": 59.2,
      "max": 85.9,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 2866.3,
      "min": 2850.7,
      "max": 2869.0,
      "n": 3
     },
     "ttft_s": {
      "median": 64.292,
      "min": 64.22,
      "max": 64.618,
      "n": 3
     },
     "decode_tps": {
      "median": 79.9,
      "min": 74.4,
      "max": 82.9,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 2843.5,
      "min": 2827.9,
      "max": 2846.5,
      "n": 3
     },
     "ttft_s": {
      "median": 88.007,
      "min": 87.9,
      "max": 88.499,
      "n": 3
     },
     "decode_tps": {
      "median": 76.8,
      "min": 75.5,
      "max": 81.3,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-18-extended-rtx-3090-swift-1.5-iq3_xxs-2",
   "tag": "2",
   "date": "2026-10-18",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 24576,
   "gpus_used": null,
   "gpus_host": 1,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "6dc36961",
   "expert_slots": 18950,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1451.1,
      "min": 1402.4,
      "max": 1477.6,
      "n": 3
     },
     "ttft_s": {
      "median": 2.788,
      "min": 2.755,
      "max": 2.885,
      "n": 3
     },
     "decode_tps": {
      "median": 90.7,
      "min": 61.1,
      "max": 108.5,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2257.7,
      "min": 2253.8,
      "max": 2275.5,
      "n": 3
     },
     "ttft_s": {
      "median": 7.158,
      "min": 7.108,
      "max": 7.166,
      "n": 3
     },
     "decode_tps": {
      "median": 88.1,
      "min": 60.9,
      "max": 91.1,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2776.5,
      "min": 2774.9,
      "max": 2785.9,
      "n": 3
     },
     "ttft_s": {
      "median": 11.586,
      "min": 11.578,
      "max": 11.596,
      "n": 3
     },
     "decode_tps": {
      "median": 70.5,
      "min": 62.5,
      "max": 83.2,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 3260.9,
      "min": 3174.9,
      "max": 3287.3,
      "n": 3
     },
     "ttft_s": {
      "median": 19.709,
      "min": 19.552,
      "max": 20.248,
      "n": 3
     },
     "decode_tps": {
      "median": 95.1,
      "min": 95.0,
      "max": 97.8,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 3307.8,
      "min": 3304.8,
      "max": 3338.1,
      "n": 3
     },
     "ttft_s": {
      "median": 26.118,
      "min": 25.869,
      "max": 26.131,
      "n": 3
     },
     "decode_tps": {
      "median": 79.3,
      "min": 74.6,
      "max": 90.8,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 3428.4,
      "min": 3402.7,
      "max": 3468.5,
      "n": 3
     },
     "ttft_s": {
      "median": 37.45,
      "min": 37.013,
      "max": 37.71,
      "n": 3
     },
     "decode_tps": {
      "median": 79.6,
      "min": 55.3,
      "max": 80.5,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 3427.5,
      "min": 3418.6,
      "max": 3448.9,
      "n": 3
     },
     "ttft_s": {
      "median": 43.854,
      "min": 43.592,
      "max": 43.966,
      "n": 3
     },
     "decode_tps": {
      "median": 72.6,
      "min": 61.3,
      "max": 84.0,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 3448.1,
      "min": 3440.3,
      "max": 3452.5,
      "n": 3
     },
     "ttft_s": {
      "median": 53.473,
      "min": 53.392,
      "max": 53.566,
      "n": 3
     },
     "decode_tps": {
      "median": 73.4,
      "min": 68.0,
      "max": 81.8,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 3408.2,
      "min": 3362.7,
      "max": 3411.4,
      "n": 3
     },
     "ttft_s": {
      "median": 73.464,
      "min": 73.403,
      "max": 74.44,
      "n": 3
     },
     "decode_tps": {
      "median": 81.6,
      "min": 76.9,
      "max": 81.7,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-extended-1x-rtx-3090-swift-1.5-iq3_xxs",
   "tag": "",
   "date": "2026-10-19",
   "kind": "extended",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": 1,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "477c1dc2",
   "expert_slots": 7647,
   "note": "tuned +75/+300",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 1385.5,
      "min": 1370.5,
      "max": 1389.0,
      "n": 3
     },
     "ttft_s": {
      "median": 2.92,
      "min": 2.911,
      "max": 2.971,
      "n": 3
     },
     "decode_tps": {
      "median": 68.1,
      "min": 58.4,
      "max": 69.9,
      "n": 3
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2538.1,
      "min": 2537.5,
      "max": 2539.5,
      "n": 3
     },
     "ttft_s": {
      "median": 6.363,
      "min": 6.353,
      "max": 6.369,
      "n": 3
     },
     "decode_tps": {
      "median": 93.8,
      "min": 89.4,
      "max": 99.7,
      "n": 3
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2583.6,
      "min": 2582.3,
      "max": 2587.3,
      "n": 3
     },
     "ttft_s": {
      "median": 12.441,
      "min": 12.439,
      "max": 12.46,
      "n": 3
     },
     "decode_tps": {
      "median": 83.7,
      "min": 73.5,
      "max": 92.5,
      "n": 3
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2575.4,
      "min": 2574.7,
      "max": 2577.2,
      "n": 3
     },
     "ttft_s": {
      "median": 24.935,
      "min": 24.927,
      "max": 24.939,
      "n": 3
     },
     "decode_tps": {
      "median": 90.6,
      "min": 73.5,
      "max": 93.5,
      "n": 3
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 2502.5,
      "min": 2496.2,
      "max": 2505.7,
      "n": 3
     },
     "ttft_s": {
      "median": 34.499,
      "min": 34.46,
      "max": 34.568,
      "n": 3
     },
     "decode_tps": {
      "median": 96.9,
      "min": 84.4,
      "max": 98.7,
      "n": 3
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 2494.5,
      "min": 2483.8,
      "max": 2494.8,
      "n": 3
     },
     "ttft_s": {
      "median": 51.422,
      "min": 51.405,
      "max": 51.63,
      "n": 3
     },
     "decode_tps": {
      "median": 74.7,
      "min": 69.7,
      "max": 75.6,
      "n": 3
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 2431.1,
      "min": 2429.7,
      "max": 2431.5,
      "n": 3
     },
     "ttft_s": {
      "median": 61.78,
      "min": 61.757,
      "max": 61.82,
      "n": 3
     },
     "decode_tps": {
      "median": 81.4,
      "min": 79.3,
      "max": 85.5,
      "n": 3
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 2415.3,
      "min": 2415.2,
      "max": 2416.8,
      "n": 3
     },
     "ttft_s": {
      "median": 76.246,
      "min": 76.215,
      "max": 76.276,
      "n": 3
     },
     "decode_tps": {
      "median": 94.6,
      "min": 77.9,
      "max": 97.4,
      "n": 3
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 2343.0,
      "min": 2339.4,
      "max": 2345.4,
      "n": 3
     },
     "ttft_s": {
      "median": 106.766,
      "min": 106.66,
      "max": 106.946,
      "n": 3
     },
     "decode_tps": {
      "median": 77.6,
      "min": 71.0,
      "max": 78.6,
      "n": 3
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-extended-2x-rtx-3090-unsloth-ud-iq4_xs",
   "tag": "",
   "date": "2026-10-19",
   "kind": "extended",
   "model": "unsloth-ud-iq4_xs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "477c1dc2",
   "expert_slots": 4773,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 768.2,
      "min": 764.7,
      "max": 771.7,
      "n": 2
     },
     "ttft_s": {
      "median": 5.263,
      "min": 5.234,
      "max": 5.292,
      "n": 2
     },
     "decode_tps": {
      "median": 28.1,
      "min": 25.2,
      "max": 31.0,
      "n": 2
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1331.55,
      "min": 1325.1,
      "max": 1338.0,
      "n": 2
     },
     "ttft_s": {
      "median": 12.093,
      "min": 12.035,
      "max": 12.15,
      "n": 2
     },
     "decode_tps": {
      "median": 33.75,
      "min": 31.7,
      "max": 35.8,
      "n": 2
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 1405.45,
      "min": 1403.2,
      "max": 1407.7,
      "n": 2
     },
     "ttft_s": {
      "median": 22.853,
      "min": 22.826,
      "max": 22.88,
      "n": 2
     },
     "decode_tps": {
      "median": 51.4,
      "min": 46.0,
      "max": 56.8,
      "n": 2
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 1430.55,
      "min": 1422.4,
      "max": 1438.7,
      "n": 2
     },
     "ttft_s": {
      "median": 44.843,
      "min": 44.591,
      "max": 45.094,
      "n": 2
     },
     "decode_tps": {
      "median": 56.3,
      "min": 45.8,
      "max": 66.8,
      "n": 2
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 1425.15,
      "min": 1423.0,
      "max": 1427.3,
      "n": 2
     },
     "ttft_s": {
      "median": 60.477,
      "min": 60.384,
      "max": 60.57,
      "n": 2
     },
     "decode_tps": {
      "median": 84.85,
      "min": 82.2,
      "max": 87.5,
      "n": 2
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 1438.6,
      "min": 1438.5,
      "max": 1438.7,
      "n": 2
     },
     "ttft_s": {
      "median": 89.054,
      "min": 89.049,
      "max": 89.058,
      "n": 2
     },
     "decode_tps": {
      "median": 57.6,
      "min": 40.2,
      "max": 75.0,
      "n": 2
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 1414.45,
      "min": 1413.7,
      "max": 1415.2,
      "n": 2
     },
     "ttft_s": {
      "median": 106.1,
      "min": 106.044,
      "max": 106.155,
      "n": 2
     },
     "decode_tps": {
      "median": 66.6,
      "min": 54.8,
      "max": 78.4,
      "n": 2
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 1413.7,
      "min": 1411.7,
      "max": 1415.7,
      "n": 2
     },
     "ttft_s": {
      "median": 130.194,
      "min": 130.026,
      "max": 130.362,
      "n": 2
     },
     "decode_tps": {
      "median": 68.95,
      "min": 63.2,
      "max": 74.7,
      "n": 2
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 1397.4,
      "min": 1397.3,
      "max": 1397.5,
      "n": 2
     },
     "ttft_s": {
      "median": 178.905,
      "min": 178.887,
      "max": 178.923,
      "n": 2
     },
     "decode_tps": {
      "median": 41.3,
      "min": 40.9,
      "max": 41.7,
      "n": 2
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-extended-2x-rtx-3090-unsloth-ud-iq4_xs-2",
   "tag": "2",
   "date": "2026-10-19",
   "kind": "extended",
   "model": "unsloth-ud-iq4_xs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 1,
   "commit": "477c1dc2",
   "expert_slots": 12137,
   "note": "",
   "streams": 1,
   "layout": "1 slot × 1 stream",
   "points": [
    {
     "label": "4K",
     "target": 4096,
     "prompt_tps": {
      "median": 926.55,
      "min": 915.5,
      "max": 937.6,
      "n": 2
     },
     "ttft_s": {
      "median": 4.36,
      "min": 4.308,
      "max": 4.412,
      "n": 2
     },
     "decode_tps": {
      "median": 60.65,
      "min": 55.5,
      "max": 65.8,
      "n": 2
     }
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1676.55,
      "min": 1672.3,
      "max": 1680.8,
      "n": 2
     },
     "ttft_s": {
      "median": 9.615,
      "min": 9.587,
      "max": 9.643,
      "n": 2
     },
     "decode_tps": {
      "median": 58.05,
      "min": 42.8,
      "max": 73.3,
      "n": 2
     }
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2080.7,
      "min": 2077.5,
      "max": 2083.9,
      "n": 2
     },
     "ttft_s": {
      "median": 15.442,
      "min": 15.416,
      "max": 15.469,
      "n": 2
     },
     "decode_tps": {
      "median": 85.9,
      "min": 81.7,
      "max": 90.1,
      "n": 2
     }
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2398.8,
      "min": 2395.7,
      "max": 2401.9,
      "n": 2
     },
     "ttft_s": {
      "median": 26.76,
      "min": 26.73,
      "max": 26.79,
      "n": 2
     },
     "decode_tps": {
      "median": 75.4,
      "min": 62.7,
      "max": 88.1,
      "n": 2
     }
    },
    {
     "label": "86K",
     "target": 88064,
     "prompt_tps": {
      "median": 2464.2,
      "min": 2452.9,
      "max": 2475.5,
      "n": 2
     },
     "ttft_s": {
      "median": 35.079,
      "min": 34.917,
      "max": 35.242,
      "n": 2
     },
     "decode_tps": {
      "median": 45.7,
      "min": 39.7,
      "max": 51.7,
      "n": 2
     }
    },
    {
     "label": "128K",
     "target": 131072,
     "prompt_tps": {
      "median": 2582.75,
      "min": 2572.7,
      "max": 2592.8,
      "n": 2
     },
     "ttft_s": {
      "median": 49.662,
      "min": 49.478,
      "max": 49.846,
      "n": 2
     },
     "decode_tps": {
      "median": 87.85,
      "min": 77.4,
      "max": 98.3,
      "n": 2
     }
    },
    {
     "label": "150K",
     "target": 153600,
     "prompt_tps": {
      "median": 2578.25,
      "min": 2573.7,
      "max": 2582.8,
      "n": 2
     },
     "ttft_s": {
      "median": 58.281,
      "min": 58.189,
      "max": 58.372,
      "n": 2
     },
     "decode_tps": {
      "median": 89.5,
      "min": 87.9,
      "max": 91.1,
      "n": 2
     }
    },
    {
     "label": "184K",
     "target": 188416,
     "prompt_tps": {
      "median": 2598.65,
      "min": 2584.8,
      "max": 2612.5,
      "n": 2
     },
     "ttft_s": {
      "median": 70.909,
      "min": 70.502,
      "max": 71.316,
      "n": 2
     },
     "decode_tps": {
      "median": 64.1,
      "min": 51.1,
      "max": 77.1,
      "n": 2
     }
    },
    {
     "label": "250K",
     "target": 256000,
     "prompt_tps": {
      "median": 2602.55,
      "min": 2598.6,
      "max": 2606.5,
      "n": 2
     },
     "ttft_s": {
      "median": 96.163,
      "min": 96.016,
      "max": 96.31,
      "n": 2
     },
     "decode_tps": {
      "median": 71.75,
      "min": 63.1,
      "max": 80.4,
      "n": 2
     }
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-2x",
   "tag": "2x",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 4,
   "commit": "477c1dc2",
   "expert_slots": 9732,
   "note": "",
   "streams": 2,
   "layout": "4 slots × 2 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 1434.4,
      "min": 1426.7,
      "max": 1445.9,
      "n": null
     },
     "ttft_s": {
      "median": 8.48,
      "min": null,
      "max": 11.4,
      "n": null
     },
     "decode_tps": {
      "median": 37.5,
      "min": 3.9,
      "max": 73.5,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1357.7,
      "min": 1351.4,
      "max": 1364.0,
      "n": null
     },
     "scaling": 0.94
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1930.2,
      "min": 1910.9,
      "max": 1937.8,
      "n": null
     },
     "ttft_s": {
      "median": 12.67,
      "min": null,
      "max": 17.0,
      "n": null
     },
     "decode_tps": {
      "median": 36.0,
      "min": 2.7,
      "max": 74.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1838.2,
      "min": 1830.8,
      "max": 1845.5,
      "n": null
     },
     "scaling": 0.95
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2319.7,
      "min": 2311.4,
      "max": 2328.6,
      "n": null
     },
     "ttft_s": {
      "median": 20.94,
      "min": null,
      "max": 28.1,
      "n": null
     },
     "decode_tps": {
      "median": 33.2,
      "min": 1.6,
      "max": 78.1,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2229.5,
      "min": 2225.1,
      "max": 2233.9,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2678.6,
      "min": 2663.6,
      "max": 2684.6,
      "n": null
     },
     "ttft_s": {
      "median": 36.32,
      "min": null,
      "max": 48.63,
      "n": null
     },
     "decode_tps": {
      "median": 36.6,
      "min": 1.0,
      "max": 75.4,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2592.1,
      "min": 2590.6,
      "max": 2593.6,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "96K",
     "target": 98304,
     "prompt_tps": {
      "median": 2795.1,
      "min": 2781.1,
      "max": 2801.3,
      "n": null
     },
     "ttft_s": {
      "median": 52.23,
      "min": null,
      "max": 69.84,
      "n": null
     },
     "decode_tps": {
      "median": 35.3,
      "min": 0.7,
      "max": 73.1,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2709.8,
      "min": 2706.7,
      "max": 2713.0,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "127K",
     "target": 130048,
     "prompt_tps": {
      "median": 2830.5,
      "min": 2828.6,
      "max": 2846.5,
      "n": null
     },
     "ttft_s": {
      "median": 67.9,
      "min": null,
      "max": 90.94,
      "n": null
     },
     "decode_tps": {
      "median": 35.8,
      "min": 0.5,
      "max": 76.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2756.8,
      "min": 2752.7,
      "max": 2761.0,
      "n": null
     },
     "scaling": 0.97
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-2x-2",
   "tag": "2x-2",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 3,
   "commit": "477c1dc2",
   "expert_slots": 12029,
   "note": "",
   "streams": 2,
   "layout": "3 slots × 2 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 1531.9,
      "min": 1519.0,
      "max": 1539.5,
      "n": null
     },
     "ttft_s": {
      "median": 7.96,
      "min": null,
      "max": 10.7,
      "n": null
     },
     "decode_tps": {
      "median": 29.4,
      "min": 4.1,
      "max": 55.1,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1427.9,
      "min": 1425.3,
      "max": 1430.5,
      "n": null
     },
     "scaling": 0.93
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1806.8,
      "min": 1551.0,
      "max": 2062.0,
      "n": null
     },
     "ttft_s": {
      "median": 13.1,
      "min": null,
      "max": 18.38,
      "n": null
     },
     "decode_tps": {
      "median": 41.6,
      "min": 4.7,
      "max": 79.8,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1704.0,
      "min": 1702.9,
      "max": 1705.0,
      "n": null
     },
     "scaling": 0.82
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2055.9,
      "min": 1614.7,
      "max": 2496.7,
      "n": null
     },
     "ttft_s": {
      "median": 22.97,
      "min": null,
      "max": 33.05,
      "n": null
     },
     "decode_tps": {
      "median": 41.3,
      "min": 4.7,
      "max": 80.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1907.7,
      "min": 1907.3,
      "max": 1908.0,
      "n": null
     },
     "scaling": 0.77
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2278.9,
      "min": 1688.3,
      "max": 2877.5,
      "n": null
     },
     "ttft_s": {
      "median": 41.66,
      "min": null,
      "max": 60.88,
      "n": null
     },
     "decode_tps": {
      "median": 42.4,
      "min": 4.9,
      "max": 79.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2077.0,
      "min": 2076.4,
      "max": 2077.6,
      "n": null
     },
     "scaling": 0.72
    },
    {
     "label": "96K",
     "target": 98304,
     "prompt_tps": {
      "median": 2255.6,
      "min": 1690.3,
      "max": 2819.9,
      "n": null
     },
     "ttft_s": {
      "median": 62.91,
      "min": null,
      "max": 91.81,
      "n": null
     },
     "decode_tps": {
      "median": 40.2,
      "min": 4.9,
      "max": 76.5,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2068.2,
      "min": 2066.3,
      "max": 2070.2,
      "n": null
     },
     "scaling": 0.73
    },
    {
     "label": "127K",
     "target": 130048,
     "prompt_tps": {
      "median": 2292.1,
      "min": 1675.6,
      "max": 2900.9,
      "n": null
     },
     "ttft_s": {
      "median": 82.1,
      "min": null,
      "max": 120.8,
      "n": null
     },
     "decode_tps": {
      "median": 40.4,
      "min": 4.7,
      "max": 78.6,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2086.3,
      "min": 2080.2,
      "max": 2092.5,
      "n": null
     },
     "scaling": 0.72
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-2x-3",
   "tag": "2x-3",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 2,
   "commit": "477c1dc2",
   "expert_slots": 14332,
   "note": "",
   "streams": 2,
   "layout": "2 slots × 2 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 1609.8,
      "min": 1602.8,
      "max": 1629.7,
      "n": null
     },
     "ttft_s": {
      "median": 7.56,
      "min": null,
      "max": 10.19,
      "n": null
     },
     "decode_tps": {
      "median": 35.1,
      "min": 4.4,
      "max": 71.7,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1512.1,
      "min": 1502.6,
      "max": 1521.6,
      "n": null
     },
     "scaling": 0.94
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2194.8,
      "min": 2191.0,
      "max": 2212.2,
      "n": null
     },
     "ttft_s": {
      "median": 11.11,
      "min": null,
      "max": 14.91,
      "n": null
     },
     "decode_tps": {
      "median": 40.7,
      "min": 3.1,
      "max": 80.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2093.2,
      "min": 2087.5,
      "max": 2098.9,
      "n": null
     },
     "scaling": 0.95
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2689.6,
      "min": 2678.3,
      "max": 2709.4,
      "n": null
     },
     "ttft_s": {
      "median": 18.08,
      "min": null,
      "max": 24.2,
      "n": null
     },
     "decode_tps": {
      "median": 37.8,
      "min": 1.9,
      "max": 76.5,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2589.1,
      "min": 2586.7,
      "max": 2591.6,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 3127.2,
      "min": 3114.1,
      "max": 3134.5,
      "n": null
     },
     "ttft_s": {
      "median": 31.08,
      "min": null,
      "max": 41.68,
      "n": null
     },
     "decode_tps": {
      "median": 37.7,
      "min": 1.1,
      "max": 79.4,
      "n": null
     },
     "total_prompt_tps": {
      "median": 3023.1,
      "min": 3015.6,
      "max": 3030.6,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "96K",
     "target": 98304,
     "prompt_tps": {
      "median": 3272.5,
      "min": 3240.6,
      "max": 3279.5,
      "n": null
     },
     "ttft_s": {
      "median": 44.56,
      "min": null,
      "max": 59.73,
      "n": null
     },
     "decode_tps": {
      "median": 37.9,
      "min": 0.8,
      "max": 75.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 3166.6,
      "min": 3161.3,
      "max": 3171.9,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "127K",
     "target": 130048,
     "prompt_tps": {
      "median": 3330.2,
      "min": 3317.3,
      "max": 3352.8,
      "n": null
     },
     "ttft_s": {
      "median": 57.81,
      "min": null,
      "max": 77.46,
      "n": null
     },
     "decode_tps": {
      "median": 35.9,
      "min": 0.6,
      "max": 77.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 3234.3,
      "min": 3225.5,
      "max": 3243.1,
      "n": null
     },
     "scaling": 0.97
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-2x-5",
   "tag": "2x-5",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": 1,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 3,
   "commit": "477c1dc2",
   "expert_slots": 489,
   "note": "",
   "streams": 2,
   "layout": "3 slots × 2 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 301.1,
      "min": 296.7,
      "max": 305.7,
      "n": null
     },
     "ttft_s": {
      "median": 39.96,
      "min": null,
      "max": 53.62,
      "n": null
     },
     "decode_tps": {
      "median": 16.9,
      "min": 5.5,
      "max": 29.0,
      "n": null
     },
     "total_prompt_tps": {
      "median": 294.0,
      "min": 293.8,
      "max": 294.1,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 293.4,
      "min": 291.4,
      "max": 295.6,
      "n": null
     },
     "ttft_s": {
      "median": 82.12,
      "min": null,
      "max": 109.86,
      "n": null
     },
     "decode_tps": {
      "median": 19.7,
      "min": 5.5,
      "max": 34.8,
      "n": null
     },
     "total_prompt_tps": {
      "median": 290.0,
      "min": 289.9,
      "max": 290.2,
      "n": null
     },
     "scaling": 0.98
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 288.8,
      "min": 288.2,
      "max": 289.9,
      "n": null
     },
     "ttft_s": {
      "median": 166.61,
      "min": null,
      "max": 222.53,
      "n": null
     },
     "decode_tps": {
      "median": 19.8,
      "min": 5.5,
      "max": 34.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 286.9,
      "min": 286.7,
      "max": 287.0,
      "n": null
     },
     "scaling": 0.99
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 290.4,
      "min": 289.8,
      "max": 291.0,
      "n": null
     },
     "ttft_s": {
      "median": 330.93,
      "min": null,
      "max": 441.75,
      "n": null
     },
     "decode_tps": {
      "median": 19.3,
      "min": 5.4,
      "max": 33.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 289.1,
      "min": 289.1,
      "max": 289.1,
      "n": null
     },
     "scaling": 0.99
    },
    {
     "label": "96K",
     "target": 98304,
     "prompt_tps": {
      "median": 290.1,
      "min": 289.7,
      "max": 290.8,
      "n": null
     },
     "ttft_s": {
      "median": 497.22,
      "min": null,
      "max": 663.41,
      "n": null
     },
     "decode_tps": {
      "median": 17.4,
      "min": 5.4,
      "max": 33.4,
      "n": null
     },
     "total_prompt_tps": {
      "median": 289.0,
      "min": 288.8,
      "max": 289.1,
      "n": null
     },
     "scaling": 0.99
    },
    {
     "label": "127K",
     "target": 130048,
     "prompt_tps": {
      "median": 289.6,
      "min": 288.8,
      "max": 290.6,
      "n": null
     },
     "ttft_s": {
      "median": 657.66,
      "min": null,
      "max": 879.46,
      "n": null
     },
     "decode_tps": {
      "median": 19.1,
      "min": 5.4,
      "max": 33.1,
      "n": null
     },
     "total_prompt_tps": {
      "median": 288.6,
      "min": 288.0,
      "max": 289.3,
      "n": null
     },
     "scaling": 1.0
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-2x-6",
   "tag": "2x-6",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": 1,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 2,
   "commit": "477c1dc2",
   "expert_slots": 2794,
   "note": "",
   "streams": 2,
   "layout": "2 slots × 2 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 2035.2,
      "min": 2029.9,
      "max": 2051.9,
      "n": null
     },
     "ttft_s": {
      "median": 6.04,
      "min": null,
      "max": 8.14,
      "n": null
     },
     "decode_tps": {
      "median": 17.6,
      "min": 4.9,
      "max": 32.6,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1780.2,
      "min": 1777.0,
      "max": 1783.3,
      "n": null
     },
     "scaling": 0.88
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 2069.4,
      "min": 1969.2,
      "max": 2170.8,
      "n": null
     },
     "ttft_s": {
      "median": 11.64,
      "min": null,
      "max": 15.86,
      "n": null
     },
     "decode_tps": {
      "median": 29.5,
      "min": 5.6,
      "max": 56.7,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1947.7,
      "min": 1944.4,
      "max": 1951.0,
      "n": null
     },
     "scaling": 0.9
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2152.8,
      "min": 2097.1,
      "max": 2208.4,
      "n": null
     },
     "ttft_s": {
      "median": 22.43,
      "min": null,
      "max": 30.27,
      "n": null
     },
     "decode_tps": {
      "median": 30.1,
      "min": 5.6,
      "max": 55.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2067.1,
      "min": 2067.0,
      "max": 2067.1,
      "n": null
     },
     "scaling": 0.94
    },
    {
     "label": "64K",
     "target": 65536,
     "prompt_tps": {
      "median": 2179.5,
      "min": 2152.7,
      "max": 2207.7,
      "n": null
     },
     "ttft_s": {
      "median": 44.33,
      "min": null,
      "max": 59.56,
      "n": null
     },
     "decode_tps": {
      "median": 28.6,
      "min": 5.6,
      "max": 52.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2113.9,
      "min": 2113.3,
      "max": 2114.6,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "96K",
     "target": 98304,
     "prompt_tps": {
      "median": 2166.4,
      "min": 2146.2,
      "max": 2184.8,
      "n": null
     },
     "ttft_s": {
      "median": 66.91,
      "min": null,
      "max": 89.79,
      "n": null
     },
     "decode_tps": {
      "median": 24.8,
      "min": 5.5,
      "max": 51.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2107.8,
      "min": 2107.6,
      "max": 2108.1,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "127K",
     "target": 130048,
     "prompt_tps": {
      "median": 2125.7,
      "min": 2111.7,
      "max": 2142.2,
      "n": null
     },
     "ttft_s": {
      "median": 90.14,
      "min": null,
      "max": 120.89,
      "n": null
     },
     "decode_tps": {
      "median": 28.1,
      "min": 5.5,
      "max": 51.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2075.8,
      "min": 2072.8,
      "max": 2078.7,
      "n": null
     },
     "scaling": 0.97
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-3x",
   "tag": "3x",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 4,
   "commit": "477c1dc2",
   "expert_slots": 9732,
   "note": "",
   "streams": 3,
   "layout": "4 slots × 3 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 1447.6,
      "min": 1378.0,
      "max": 1460.6,
      "n": null
     },
     "ttft_s": {
      "median": 11.37,
      "min": null,
      "max": 17.31,
      "n": null
     },
     "decode_tps": {
      "median": 3.8,
      "min": 1.9,
      "max": 45.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1348.8,
      "min": 1330.1,
      "max": 1367.6,
      "n": null
     },
     "scaling": 0.95
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1878.6,
      "min": 1856.1,
      "max": 1903.0,
      "n": null
     },
     "ttft_s": {
      "median": 17.38,
      "min": null,
      "max": 26.22,
      "n": null
     },
     "decode_tps": {
      "median": 2.6,
      "min": 1.3,
      "max": 58.4,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1798.4,
      "min": 1792.8,
      "max": 1804.0,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2244.4,
      "min": 2184.7,
      "max": 2259.0,
      "n": null
     },
     "ttft_s": {
      "median": 29.21,
      "min": null,
      "max": 43.99,
      "n": null
     },
     "decode_tps": {
      "median": 1.6,
      "min": 0.8,
      "max": 58.7,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2149.2,
      "min": 2146.4,
      "max": 2152.0,
      "n": null
     },
     "scaling": 0.95
    },
    {
     "label": "48K",
     "target": 49152,
     "prompt_tps": {
      "median": 2449.6,
      "min": 2424.5,
      "max": 2469.1,
      "n": null
     },
     "ttft_s": {
      "median": 39.72,
      "min": null,
      "max": 60.01,
      "n": null
     },
     "decode_tps": {
      "median": 1.2,
      "min": 0.6,
      "max": 59.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2368.2,
      "min": 2361.3,
      "max": 2375.0,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "56K",
     "target": 57344,
     "prompt_tps": {
      "median": 2511.2,
      "min": 2400.7,
      "max": 2540.1,
      "n": null
     },
     "ttft_s": {
      "median": 45.41,
      "min": null,
      "max": 68.98,
      "n": null
     },
     "decode_tps": {
      "median": 1.0,
      "min": 0.5,
      "max": 57.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2416.3,
      "min": 2390.6,
      "max": 2442.1,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "84K",
     "target": 86016,
     "prompt_tps": {
      "median": 2508.4,
      "min": 2467.1,
      "max": 2583.8,
      "n": null
     },
     "ttft_s": {
      "median": 68.36,
      "min": null,
      "max": 102.83,
      "n": null
     },
     "decode_tps": {
      "median": 0.7,
      "min": 0.3,
      "max": 57.0,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2443.8,
      "min": 2409.6,
      "max": 2477.9,
      "n": null
     },
     "scaling": 0.94
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-3x-2",
   "tag": "3x-2",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 3,
   "commit": "477c1dc2",
   "expert_slots": 12029,
   "note": "",
   "streams": 3,
   "layout": "3 slots × 3 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 1526.7,
      "min": 1501.0,
      "max": 1528.1,
      "n": null
     },
     "ttft_s": {
      "median": 10.77,
      "min": null,
      "max": 16.21,
      "n": null
     },
     "decode_tps": {
      "median": 4.0,
      "min": 2.1,
      "max": 45.1,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1429.0,
      "min": 1423.3,
      "max": 1434.7,
      "n": null
     },
     "scaling": 0.95
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1569.2,
      "min": 1547.2,
      "max": 2067.3,
      "n": null
     },
     "ttft_s": {
      "median": 18.31,
      "min": null,
      "max": 28.85,
      "n": null
     },
     "decode_tps": {
      "median": 4.8,
      "min": 4.6,
      "max": 80.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1645.7,
      "min": 1640.8,
      "max": 1650.5,
      "n": null
     },
     "scaling": 0.79
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 1629.8,
      "min": 1609.8,
      "max": 2504.8,
      "n": null
     },
     "ttft_s": {
      "median": 32.92,
      "min": null,
      "max": 53.04,
      "n": null
     },
     "decode_tps": {
      "median": 4.8,
      "min": 4.7,
      "max": 80.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1796.2,
      "min": 1790.2,
      "max": 1802.2,
      "n": null
     },
     "scaling": 0.72
    },
    {
     "label": "48K",
     "target": 49152,
     "prompt_tps": {
      "median": 1661.2,
      "min": 1657.1,
      "max": 2745.0,
      "n": null
     },
     "ttft_s": {
      "median": 47.13,
      "min": null,
      "max": 76.62,
      "n": null
     },
     "decode_tps": {
      "median": 5.0,
      "min": 4.9,
      "max": 79.4,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1867.6,
      "min": 1862.7,
      "max": 1872.5,
      "n": null
     },
     "scaling": 0.69
    },
    {
     "label": "56K",
     "target": 57344,
     "prompt_tps": {
      "median": 1684.1,
      "min": 1678.4,
      "max": 2818.0,
      "n": null
     },
     "ttft_s": {
      "median": 53.96,
      "min": null,
      "max": 87.75,
      "n": null
     },
     "decode_tps": {
      "median": 5.0,
      "min": 4.9,
      "max": 83.5,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1901.3,
      "min": 1899.4,
      "max": 1903.2,
      "n": null
     },
     "scaling": 0.68
    },
    {
     "label": "84K",
     "target": 86016,
     "prompt_tps": {
      "median": 1660.7,
      "min": 1654.3,
      "max": 2690.1,
      "n": null
     },
     "ttft_s": {
      "median": 82.95,
      "min": null,
      "max": 134.41,
      "n": null
     },
     "decode_tps": {
      "median": 4.9,
      "min": 4.8,
      "max": 81.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1863.8,
      "min": 1863.0,
      "max": 1864.5,
      "n": null
     },
     "scaling": 0.69
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-3x-4",
   "tag": "3x-4",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": 1,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 3,
   "commit": "477c1dc2",
   "expert_slots": 489,
   "note": "",
   "streams": 3,
   "layout": "3 slots × 3 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 296.9,
      "min": 296.4,
      "max": 305.4,
      "n": null
     },
     "ttft_s": {
      "median": 53.63,
      "min": null,
      "max": 80.89,
      "n": null
     },
     "decode_tps": {
      "median": 5.5,
      "min": 5.5,
      "max": 33.7,
      "n": null
     },
     "total_prompt_tps": {
      "median": 294.4,
      "min": 294.3,
      "max": 294.4,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 291.6,
      "min": 290.7,
      "max": 295.1,
      "n": null
     },
     "ttft_s": {
      "median": 110.01,
      "min": null,
      "max": 165.53,
      "n": null
     },
     "decode_tps": {
      "median": 5.5,
      "min": 5.5,
      "max": 35.0,
      "n": null
     },
     "total_prompt_tps": {
      "median": 289.5,
      "min": 289.4,
      "max": 289.6,
      "n": null
     },
     "scaling": 0.98
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 288.0,
      "min": 287.7,
      "max": 290.1,
      "n": null
     },
     "ttft_s": {
      "median": 222.43,
      "min": null,
      "max": 334.24,
      "n": null
     },
     "decode_tps": {
      "median": 5.5,
      "min": 5.3,
      "max": 35.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 286.9,
      "min": 286.7,
      "max": 287.0,
      "n": null
     },
     "scaling": 0.99
    },
    {
     "label": "48K",
     "target": 49152,
     "prompt_tps": {
      "median": 292.1,
      "min": 291.5,
      "max": 293.4,
      "n": null
     },
     "ttft_s": {
      "median": 329.1,
      "min": null,
      "max": 494.55,
      "n": null
     },
     "decode_tps": {
      "median": 5.5,
      "min": 5.4,
      "max": 34.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 290.9,
      "min": 290.8,
      "max": 290.9,
      "n": null
     },
     "scaling": 0.99
    },
    {
     "label": "56K",
     "target": 57344,
     "prompt_tps": {
      "median": 290.8,
      "min": 290.2,
      "max": 291.9,
      "n": null
     },
     "ttft_s": {
      "median": 385.62,
      "min": null,
      "max": 579.33,
      "n": null
     },
     "decode_tps": {
      "median": 5.5,
      "min": 5.3,
      "max": 34.2,
      "n": null
     },
     "total_prompt_tps": {
      "median": 289.6,
      "min": 289.6,
      "max": 289.6,
      "n": null
     },
     "scaling": 0.99
    },
    {
     "label": "84K",
     "target": 86016,
     "prompt_tps": {
      "median": 288.4,
      "min": 288.3,
      "max": 289.2,
      "n": null
     },
     "ttft_s": {
      "median": 583.44,
      "min": null,
      "max": 875.89,
      "n": null
     },
     "decode_tps": {
      "median": 5.5,
      "min": 5.4,
      "max": 33.9,
      "n": null
     },
     "total_prompt_tps": {
      "median": 287.6,
      "min": 287.5,
      "max": 287.6,
      "n": null
     },
     "scaling": 0.99
    }
   ],
   "chat": {},
   "agent": {}
  },
  {
   "id": "2026-10-19-slots-2x-rtx-3090-swift-1.5-iq3_xxs-4x",
   "tag": "4x",
   "date": "2026-10-19",
   "kind": "slots",
   "model": "swift-1.5-iq3_xxs",
   "gpu": [
    "NVIDIA GeForce RTX 3090",
    "NVIDIA GeForce RTX 3090"
   ],
   "gpu_label": "RTX 3090",
   "vram_mib": 49152,
   "gpus_used": null,
   "gpus_host": 2,
   "cpu": "13th Gen Intel(R) Core(TM) i5-13500",
   "context": 262144,
   "parallel": 4,
   "commit": "477c1dc2",
   "expert_slots": 9732,
   "note": "tuned +75/+300",
   "streams": 4,
   "layout": "4 slots × 4 streams",
   "points": [
    {
     "label": "8K",
     "target": 8192,
     "prompt_tps": {
      "median": 1429.2,
      "min": 1424.2,
      "max": 1457.7,
      "n": null
     },
     "ttft_s": {
      "median": 14.29,
      "min": null,
      "max": 22.88,
      "n": null
     },
     "decode_tps": {
      "median": 2.9,
      "min": 1.4,
      "max": 48.6,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1362.8,
      "min": 1360.8,
      "max": 1364.9,
      "n": null
     },
     "scaling": 0.95
    },
    {
     "label": "16K",
     "target": 16384,
     "prompt_tps": {
      "median": 1930.8,
      "min": 1885.1,
      "max": 1947.8,
      "n": null
     },
     "ttft_s": {
      "median": 21.11,
      "min": null,
      "max": 34.02,
      "n": null
     },
     "decode_tps": {
      "median": 2.0,
      "min": 0.9,
      "max": 53.0,
      "n": null
     },
     "total_prompt_tps": {
      "median": 1853.2,
      "min": 1843.3,
      "max": 1863.1,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "32K",
     "target": 32768,
     "prompt_tps": {
      "median": 2306.4,
      "min": 2285.1,
      "max": 2312.5,
      "n": null
     },
     "ttft_s": {
      "median": 35.44,
      "min": null,
      "max": 56.77,
      "n": null
     },
     "decode_tps": {
      "median": 1.2,
      "min": 0.6,
      "max": 53.8,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2229.8,
      "min": 2227.6,
      "max": 2232.1,
      "n": null
     },
     "scaling": 0.96
    },
    {
     "label": "48K",
     "target": 49152,
     "prompt_tps": {
      "median": 2526.2,
      "min": 2496.4,
      "max": 2554.6,
      "n": null
     },
     "ttft_s": {
      "median": 48.29,
      "min": null,
      "max": 77.68,
      "n": null
     },
     "decode_tps": {
      "median": 0.9,
      "min": 0.4,
      "max": 55.1,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2452.3,
      "min": 2443.5,
      "max": 2461.1,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "56K",
     "target": 57344,
     "prompt_tps": {
      "median": 2599.0,
      "min": 2588.5,
      "max": 2606.0,
      "n": null
     },
     "ttft_s": {
      "median": 54.82,
      "min": null,
      "max": 87.89,
      "n": null
     },
     "decode_tps": {
      "median": 0.8,
      "min": 0.4,
      "max": 57.5,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2526.9,
      "min": 2525.8,
      "max": 2528.1,
      "n": null
     },
     "scaling": 0.97
    },
    {
     "label": "62K",
     "target": 63488,
     "prompt_tps": {
      "median": 2605.2,
      "min": 2549.3,
      "max": 2614.3,
      "n": null
     },
     "ttft_s": {
      "median": 60.48,
      "min": null,
      "max": 97.31,
      "n": null
     },
     "decode_tps": {
      "median": 0.8,
      "min": 0.3,
      "max": 57.3,
      "n": null
     },
     "total_prompt_tps": {
      "median": 2527.9,
      "min": 2520.3,
      "max": 2535.6,
      "n": null
     },
     "scaling": 0.98
    }
   ],
   "chat": {},
   "agent": {}
  }
 ]
};
