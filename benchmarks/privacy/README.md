# Real-program privacy sweep of 0.4.3 (2026-10-24)

We ran the released npm 0.4.3 twice, signed in, with a DNS Client trace and a 50 ms process-tree sampler that also follows the shared engine.

| Run | What the program did | Result |
|---|---|---|
| 1 | Started, checked the licence; every question answered "not indexed" (the plan's 3 repo slots were full) | The program's tree contacted only the licence server (12 lookups, 21 rows). npx (npm's runner) resolved the package at registry.npmjs.org; the report now lists that apart. Indexing was not exercised. |
| 2 | Read the repo, started the checkers (45 processes in the tree), answered all six steps, edit + check_my_changes | PASS: 0 lookups and 0 connections to anything (licence already checked; no send due). |

Together: start-up and licence traffic go only to `beta.llmgraph.in`; reading, checking and answering contact nothing. Limits: TLS contents not read here (read separately on a test build); no usage-count or crash send fell inside either window.

Run 2 also shows asked-first proofs on the real program: `who_calls` gave 16 `within_these [c]`; 3 seconds later `what_breaks_if_changed` showed the direct callers as `certain`; the last `who_calls` gave "16 certain".
