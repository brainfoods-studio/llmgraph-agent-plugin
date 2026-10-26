# Blind test of LLMGRAPH 0.4.2 (2026-10-22): report

Tester: one Sonnet agent with no access to the engine internals; it read only `web/content/docs/` and the repos. The repos were requests v2.32.3, rich v13.9.4 and zod v3.23.8, with dependencies installed as wheels only and npm scripts disabled. The engine was main (the 0.4.2 code) through the dev entry and the test licence. Saved by us from the tester's final message.

**Lead note on the setup:** the tester's runs did not set `LLMGRAPH_NODE`, so the TypeScript checker never started ("type checker is down") in the zod sessions. The npm package always sets it, and a re-run with it set showed "type checker starting". The zod results are therefore our own reading without the checker. Each question batch also started a new engine, so "type checker starting" and the cold timings are worse than real daemon use.

## 1. Summary
| Repo | Graded | Correct | Wrong | Silently incomplete | Misleading | Unclear | Median ms | Max ms |
|---|---|---|---|---|---|---|---|---|
| requests | 20 | 18 | 0 | 0 | 0 | 2 | 54 | 4851 (check_my_changes); question max 1089 |
| rich | 16 | 8 | 0 | 0 | 5 | 3 | 81 | 8254 (cold first question); check 5333 |
| zod | 14 | 4 | 0 | 1 | 6 | 3 | 42 | 10973 (cold first question); check 6168 |

- No wrong strong line was found. Every `within_these` list checked matched grep.
- The engine twice found calls that grep missed.
- Warm answers took 10 to 100 ms.

## 2. Non-correct answers
- **Z1 (silently incomplete).** zod `who_calls ZodObject.create`: 68 open, no "passed as a value" warning. `src/types.ts:5219` `const objectType = ZodObject.create`, exported as `z.object`, has about 400 real callers and none is named. `check_my_changes` does warn about the alias; `who_calls` does not.
- **Z2 (misleading).** zod: `deno/lib` copies are listed as candidates of the `src` definition for methods (`ZodError.format` 12 with 6 real, `mergeObjectSync` 8 with 4 real, `ZodType.parse` 1738 open). Plain functions do get "other target"; methods do not.
- **Z3-Z5 (unclear).** "2180 more deeper calls we can't see: not followed"; "passed as a value in 36 places" on a getter; `what_is_unknown` counts unexplained.
- **R1 (misleading).** rich bare `who_calls render`: "matches 9 definitions", functions only. About 20 `def render` methods (`Console.render`, ...) are omitted, and nothing says so.
- **R2 (misleading).** rich `Style.parse`: 1 in a set, 138 open, mixing `Color.parse`; about 8 real callers are hidden among 138.
- **R3 (misleading).** `Table/Panel.__rich_console__`: 8 open, 2 real, and 6 on other classes built in the same function.
- **R4 (misleading).** `Text.append`: 31 in a set, 75 open and not listed. `rich/_log_render.py:73-79` (`path_text = Text()` then `.append`) is missing from both.
- **R5-R7 (unclear).** `explain` on a collapsed group is a dead end; "38 places" vs the depth breakdown; `what_is_unknown` counts.
- **Q1/Q2 (unclear/noise).** "within_these, one of 1" for a plain imported function before the checker; "plus N dynamic calls nearby" on every answer; `threading.Event.set` and `sock.send` listed as open candidates.

## 3. check_my_changes
| Repo | Edit | Time | Result |
|---|---|---|---|
| requests | `super_len(o)` → `super_len(o, strict)` | 4851 ms | 16 breaks; grep finds exactly these 16. PASS |
| rich | `Segment.split_lines` gained required `strict` | 5333 ms | "may break" on exactly the 2 real callers. PASS |
| zod | `ZodObject.create` `params` made required | 6168 ms | named 3 `deno/lib` lines only; no `z.object(...)` call (about 400). PARTIAL/FAIL |

## 4. Best answers (unedited, quotable)
1. requests `check_my_changes` after `super_len(o, strict)`: 16 breaks, exactly the real calls (full text in the tester's message).
2. requests `who_calls hook`: finds the single real call site through a hook list, and says it cannot be sure.
3. zod `who_calls addIssueToContext`: 71 in a set, and "ruled out: 71 same-name calls (proven: other target)", which separates the `src` calls from the `deno/lib` copy that grep mixes into 143 lines.

## 5. Verdict (tester)
Reliable before editing for plain functions, typed methods and unique Python names. Not reliable on "open" lists, which are padded, or on aliased entry points. TypeScript was a hint only in this run (the checker was not started; see the lead note). Honest, with 0 wrong strong lines, but hard to read in places. Cold start and per-save timings were felt in fresh sessions.
