# Real-program privacy sweep

Desk host: beta.llmgraph.in (from %TEMP%\llmgraph-v2\real-sweep-20261024-224043\build-record.json)

| Class | DNS lookups by the program's tree | All rows (lookups + connections) |
|---|---|---|
| desk | 12 | 21 |
| loopback | 0 | 0 |
| other | 8 | 10 |

- Processes seen in the program's tree: 17
- Connection rows from the tree: 11
- Sampler: 955 samples, interval 50 ms, real max gap 78 ms, errors 0
- DNS events in the trace: 155
- DNS lookups by processes outside the tree (counted only): 135
- Desk connections and lookups (a usage-count or crash-report send shows up here): 21

FINDING: the program's tree talked to or looked up something that is not the desk.

| Kind | PID | Process | What | Detail |
|---|---|---|---|---|
| dns | 28252 | node.exe | registry.npmjs.org | 3006 |
| dns | 28252 | node.exe | registry.npmjs.org | 3008 |
| dns | 28252 | node.exe | registry.npmjs.org | 3006 |
| dns | 28252 | node.exe | registry.npmjs.org | 3008 |
| dns | 30136 | node.exe | registry.npmjs.org | 3006 |
| dns | 30136 | node.exe | registry.npmjs.org | 3008 |
| dns | 30136 | node.exe | registry.npmjs.org | 3006 |
| dns | 30136 | node.exe | registry.npmjs.org | 3008 |
| tcp | 28252 | node.exe | 2606:4700:8393:80e2:e439:5fc:6810:22:443 | ESTABLISHED |
| tcp | 30136 | node.exe | 2606:4700:8393:80e2:e439:5fc:6810:22:443 | ESTABLISHED |

## Limits

- TLS contents are not read here (WO-138 covered contents on the test program); this run covers who is talked to and looked up.
- Usage counts and crash reports are only sent when due, so a send may not fall inside this window. Desk telemetry endpoints show up as desk connections.
- The sampler sees a connection or process only if it lasts longer than its real max gap; the DNS trace has no such gap and sees every lookup the DNS Client service handled (lookups that bypass it, such as DNS over HTTPS inside a process, are not seen).
- A lookup is attributed to the program only when its process id was seen in the program's tree.
- Lookups by npm/npx (the launcher's host tooling, part of the tree) are listed like any other.
