# Real-program privacy sweep

Desk host: beta.llmgraph.in (from %TEMP%\llmgraph-v2\real-sweep-20261024-225848\build-record.json)

| Class | DNS lookups by the program's tree | All rows (lookups + connections) |
|---|---|---|
| desk | 0 | 0 |
| loopback | 0 | 0 |
| other | 0 | 0 |

- Processes seen in the program's tree: 45
- Connection rows from the tree: 2
- Sampler: 931 samples, interval 50 ms, real max gap 79 ms, errors 0
- DNS events in the trace: 70
- DNS lookups by processes outside the tree (counted only): 62
- Desk connections and lookups (a usage-count or crash-report send shows up here): 0
- npm's own runner (npx, node.exe) resolving the package at registry.npmjs.org: 8 lookups, 2 connections (not LLMGRAPH; listed apart)

PASS: during this run the program's process tree looked up and connected to the desk host and loopback only.

## Limits

- TLS contents are not read here (WO-138 covered contents on the test program); this run covers who is talked to and looked up.
- Usage counts and crash reports are only sent when due, so a send may not fall inside this window. Desk telemetry endpoints show up as desk connections.
- The sampler sees a connection or process only if it lasts longer than its real max gap; the DNS trace has no such gap and sees every lookup the DNS Client service handled (lookups that bypass it, such as DNS over HTTPS inside a process, are not seen).
- A lookup is attributed to the program only when its process id was seen in the program's tree.
- Lookups by npm/npx (the launcher's host tooling, part of the tree) are listed like any other.
