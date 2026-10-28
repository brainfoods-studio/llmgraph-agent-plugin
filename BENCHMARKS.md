# Benchmarks

We publish how we measured, what we found, and where LLMGRAPH loses. Raw data is linked under each section.

## 1. Blind test: 50 questions, three open-source repos (0.4.2, 22 October 2026)

**No confident answer was wrong.** A tester with no access to the engine's code, using only the public docs asked 50 graded questions on requests v2.32.3, rich v13.9.4 and zod v3.23.8, and checked every answer against the code.

| Repo | Graded | Correct | Wrong | Silently incomplete | Misleading | Unclear |
|---|---|---|---|---|---|---|
| requests | 20 | 18 | 0 | 0 | 0 | 2 |
| rich | 16 | 8 | 0 | 0 | 5 | 3 |
| zod | 14 | 4 | 0 | 1 | 6 | 3 |

"Confident" means a line labelled `certain`, `exactly_these` or `within_these`. None of them was wrong.

**What it found against us, and what we did:**
- One silently incomplete answer: calls through an alias in zod (`z.object`). Fixed in 0.4.3: alias calls are now flagged as a blind spot, not dropped.
- "Misleading" answers were mostly long open lists (`maybe_more`) padded with unrelated candidates. They're labelled open, never confident, but they're hard to read. Work in progress.
- The TypeScript checker wasn't started in that run, so the zod answers were our own reading only.

Method and raw answers: [benchmarks/blind-test/](benchmarks/blind-test/)

## 2. Noisy names vs a plain text search (0.4.1, 20 October 2026)

19 symbols on requests, rich, werkzeug and hono, with ground truth decided by reading every site (independent of both tools).

| | ripgrep, 1 search | LLMGRAPH |
|---|---|---|
| True callers found | 125 of 126 | 113 of 126 listed (85 claimed, 28 as open) |
| Wrong-call lines shown | 413 | 0 claimed wrong, plus 79 open items that turned out not to be callers, labelled `maybe_more` or `cannot_see`, never confident |
| Non-call lines shown | 234 | 0 |

**Where it wins:** on the 9 names that also appear in unrelated code, an agent read 12,234 tokens with one ripgrep search and 5,013 with LLMGRAPH: less than half as many.

**Where it loses (stated plainly):**
- **Clean, unique names:** ripgrep finds the same callers for fewer tokens. Use it.
- **Cold start:** the first answer from a fresh store took seconds; ripgrep takes tens of milliseconds.
- **Recall:** 13 true callers weren't listed, among them calls through a local alias in rich (flagged only as a count) and two hono methods answered about the class instead (fixed since).
- **"Ruled out" lines** can't be expanded to show each ruled-out call yet.

Method, symbols (fixed before the runs) and raw data: [benchmarks/noisy-names/](benchmarks/noisy-names/)

## 3. Privacy on the released program (0.4.3, 24 October 2026)

We ran the released npm package twice with a DNS trace and a process-tree sampler. Start-up and the licence check contacted only `beta.llmgraph.in`; reading, checking and answering contacted nothing. A separate run on the test build read the contents of what's sent: no code, paths, symbol or repo names, queries or answers.

Method and logs: [benchmarks/privacy/](benchmarks/privacy/)

## 4. Proof upgrades on the released program (0.4.3)

`who_calls super_len` on requests: 16 `within_these` (our own reading), then 16 `certain` once the type checker caught up, seconds later.

Raw answers: [benchmarks/proof-upgrade/](benchmarks/proof-upgrade/)
