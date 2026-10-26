
### requests

| symbol | truth (t/u) | rg naive recall, extra lines (wrong calls / non-calls), tok, calls, ms | rg tuned recall, extra, tok | LG recall (claimed+maybe), claimed, open noise, FP claimed | LG tokens head/full, calls, ms |
|---|---|---|---|---|---|
| rebuild_proxies | 3/0 | 3/3, +0/1, 76, 1, 35 | 3/3, +0/0, 63 | 3/3, 3/3, 0, 0 | 141/310, 2, 29 |
| get_netrc_auth | 5/0 | 5/5, +0/1, 115, 1, 33 | 5/5, +0/0, 104 | 5/5, 5/5, 0, 0 | 100/297, 2, 24 |
| Session.close | 2/0 | 2/2, +17/4, 308, 1, 33 | 2/2, +17/0, 250 | 2/2, 2/2, 13, 0 | 171/627, 3, 41 |
| HTTPAdapter.send | 1/1 | 1/1, +41/10, 787, 1, 36 | 1/1, +41/4, 672 | 1/1, 0/1, 17, 0 | 149/745, 2, 78 |
| Response.json | 20/0 | 20/20, +0/16, 656, 1, 37 | 20/20, +0/14, 621 | 20/20, 0/20, 0, 0 | 96/693, 2, 37 |

### rich

| symbol | truth (t/u) | rg naive recall, extra lines (wrong calls / non-calls), tok, calls, ms | rg tuned recall, extra, tok | LG recall (claimed+maybe), claimed, open noise, FP claimed | LG tokens head/full, calls, ms |
|---|---|---|---|---|---|
| strip_control_codes | 7/0 | 7/7, +0/1, 148, 1, 92 | 7/7, +0/0, 136 | 7/7, 7/7, 0, 0 | 89/318, 2, 61 |
| Console.render_str | 7/0 | 7/7, +0/1, 147, 1, 97 | 6/7, +0/0, 112 | 6/7, 5/7, 0, 0 | 167/361, 2, 64 |
| Console.render | 20/0 | 20/20, +113/35, 3097, 1, 92 | 17/20, +27/2, 1030 | 17/20, 16/20, 8, 0 | 185/897, 3, 89 |
| ProgressColumn.render | 1/0 | 1/1, +132/35, 3097, 1, 103 | 1/1, +43/2, 1030 | 1/1, 1/1, 9, 0 | 207/399, 2, 83 |

### werkzeug

| symbol | truth (t/u) | rg naive recall, extra lines (wrong calls / non-calls), tok, calls, ms | rg tuned recall, extra, tok | LG recall (claimed+maybe), claimed, open noise, FP claimed | LG tokens head/full, calls, ms |
|---|---|---|---|---|---|
| safe_join | 8/0 | 8/8, +0/1, 181, 1, 50 | 8/8, +0/0, 159 | 8/8, 8/8, 0, 0 | 86/369, 2, 68 |
| http_date | 8/0 | 8/8, +0/1, 184, 1, 48 | 7/8, +0/0, 157 | 8/8, 8/8, 0, 0 | 104/358, 2, 69 |
| run_wsgi_app (function) | 19/0 | 19/19, +1/2, 527, 1, 50 | 19/19, +0/0, 465 | 19/19, 17/19, 0, 0 | 166/802, 3, 74 |
| Client.run_wsgi_app (method) | 1/0 | 1/1, +19/2, 527, 1, 48 | 1/1, +0/0, 22 | 1/1, 1/1, 0, 0 | 131/131, 1, 64 |
| Response.close | 3/5 | 3/3, +32/23, 944, 1, 49 | 3/3, +31/2, 610 | 3/3, 1/3, 19, 0 | 220/800, 2, 88 |

### hono

| symbol | truth (t/u) | rg naive recall, extra lines (wrong calls / non-calls), tok, calls, ms | rg tuned recall, extra, tok | LG recall (claimed+maybe), claimed, open noise, FP claimed | LG tokens head/full, calls, ms |
|---|---|---|---|---|---|
| getCookie | 9/0 | 9/9, +0/0, 196, 1, 41 | 9/9, +0/0, 196 | 9/9, 9/9, 0, 0 | 117/381, 2, 25 |
| Context.notFound | 4/0 | 4/4, +0/5, 162, 1, 42 | 4/4, +0/5, 162 | 0/4, 0/4, 6, 1 | 193/351, 2, 46 |
| getPath (url.ts) | 1/2 | 1/1, +1/5, 190, 1, 43 | 1/1, +0/5, 130 | 1/1, 1/1, 1, 0 | 207/261, 2, 28 |
| parseBody (utils/body.ts) | 2/0 | 1/2, +0/4, 101, 1, 44 | 1/2, +0/1, 32 | 2/2, 1/2, 0, 0 | 138/138, 1, 19 |
| Context.get | 5/0 | 5/5, +57/87, 2757, 1, 47 | 5/5, +57/85, 2723 | 0/5, 0/5, 6, 1 | 193/351, 2, 49 |

## Totals (symbols; 'claimed' = certain/exactly_these/within_these; 'listed' = claimed + maybe_more + cannot_see)

| repo | symbols | true callers | rg naive found | rg naive wrong-call lines | rg naive non-call lines | rg tuned found | rg tuned wrong-call lines | LG claimed | LG listed | LG FP (claimed, wrong) | LG open items not true | rg tok naive (1 call) | rg tok 3 calls | LG tok head | LG tok full | LG calls | rg ms (median) | LG head ms (median) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| requests | 5 | 31 | 31 | 58 | 32 | 31 | 58 | 10 | 31 | 0 | 30 | 1942 | 3839 | 657 | 2672 | 11 | 35 | 37 |
| rich | 4 | 35 | 35 | 245 | 72 | 31 | 70 | 29 | 31 | 0 | 17 | 6489 | 9752 | 648 | 1975 | 9 | 97 | 83 |
| werkzeug | 5 | 39 | 39 | 52 | 29 | 38 | 31 | 35 | 39 | 0 | 19 | 2363 | 4178 | 707 | 2460 | 10 | 49 | 69 |
| hono | 5 | 21 | 20 | 58 | 101 | 20 | 57 | 11 | 12 | 2 | 13 | 3406 | 6987 | 848 | 1482 | 9 | 43 | 28 |
| ALL | 19 | 126 | 125 | 413 | 234 | 120 | 216 | 85 | 113 | 2 | 79 | 14200 | 24756 | 2860 | 8589 | 39 | 47 | 61 |

## Totals (symbols_early; 'claimed' = certain/exactly_these/within_these; 'listed' = claimed + maybe_more + cannot_see)

| repo | symbols | true callers | rg naive found | rg naive wrong-call lines | rg naive non-call lines | rg tuned found | rg tuned wrong-call lines | LG claimed | LG listed | LG FP (claimed, wrong) | LG open items not true | rg tok naive (1 call) | rg tok 3 calls | LG tok head | LG tok full | LG calls | rg ms (median) | LG head ms (median) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| requests | 5 | 31 | 31 | 58 | 32 | 31 | 58 | 10 | 31 | 0 | 30 | 1942 | 3839 | 661 | 2662 | 11 | 35 | 51 |
| rich | 4 | 35 | 35 | 245 | 72 | 31 | 70 | 29 | 31 | 0 | 19 | 6489 | 9752 | 642 | 2004 | 9 | 97 | 92 |
| werkzeug | 5 | 39 | 39 | 52 | 29 | 38 | 31 | 35 | 39 | 0 | 19 | 2363 | 4178 | 700 | 2440 | 10 | 49 | 64 |
| hono | 5 | 21 | 20 | 58 | 101 | 20 | 57 | 11 | 12 | 2 | 13 | 3406 | 6987 | 842 | 1519 | 9 | 43 | 49 |
| ALL | 19 | 126 | 125 | 413 | 234 | 120 | 216 | 85 | 113 | 2 | 81 | 14200 | 24756 | 2845 | 8625 | 39 | 47 | 64 |

## Cold start (TEST program, fresh LOCALAPPDATA per run, 3 runs; median [min-max] ms from spawn)

| repo | state | start line | first who_calls answered | first answer without 'type checker starting' | exit after stdin closed |
|---|---|---|---|---|---|
| requests | cold | 407 [403-452] | 6061 [5875-7729] | 6061 [5876-7729] | 652 [333-653] |
| requests | warm | 359 [355-420] | 1179 [1132-1335] | 4252 [4239-4565] | 218 [217-222] |
| rich | cold | 378 [366-405] | 7762 [6899-8539] | 7762 [6899-8539] | 652 [646-974] |
| rich | warm | 358 [355-368] | 2491 [2465-2574] | 4688 [4565-4780] | 529 [429-548] |
| werkzeug | cold | 365 [361-369] | 7166 [7053-7236] | 7166 [7053-7236] | 653 [649-662] |
| werkzeug | warm | 359 [355-361] | 2191 [2180-2197] | 4497 [4384-4715] | 330 [320-441] |
| hono | cold | 357 [330-369] | 4374 [4141-5000] | 4374 [4141-5000] | 325 [217-326] |
| hono | warm | 356 [348-367] | 2146 [2137-2201] | 2146 [2137-2201] | 222 [216-223] |
