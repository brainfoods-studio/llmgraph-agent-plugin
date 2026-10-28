# Real-program privacy sweep, run 1

Licence server host: beta.llmgraph.in

Result: the released program (started through npx) contacted the licence server and nothing else of ours.

| Class | DNS lookups by the program's tree | All rows (lookups + connections) |
|---|---|---|
| licence server | 12 | 21 |
| loopback | 0 | 0 |
| other | 8 | 10 |

- The "other" rows are npm's own runner (npx) resolving the package at registry.npmjs.org: 8 lookups, 2 connections. That is npm, not LLMGRAPH, and later reports list it apart.
- Licence server connections and lookups (a usage-count or crash-report send shows up here): 21.
- In this run every question answered "not indexed" (the plan's 3 repo slots were full), so indexing was not exercised; run 2 covers it.

## Limits

- TLS contents are not read here (the contents of what is sent were read separately on a test build); this run covers who is talked to and looked up.
- Usage counts and crash reports are only sent when due, so a send may not fall inside this window.
- Lookups that bypass the Windows DNS Client service (for example DNS over HTTPS inside a process) are not seen.

The raw capture is kept privately and is available on request to security@llmgraph.in.
