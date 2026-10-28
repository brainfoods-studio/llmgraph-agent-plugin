# Real-program privacy sweep, run 2

Licence server host: beta.llmgraph.in

PASS: during this run the program's process tree looked up and connected to the licence server host and loopback only.

| Class | DNS lookups by the program's tree | All rows (lookups + connections) |
|---|---|---|
| licence server | 0 | 0 |
| loopback | 0 | 0 |
| other | 0 | 0 |

- The run read the repo, started the checkers, answered six steps, then an edit and `check_my_changes`.
- Licence server connections and lookups (a usage-count or crash-report send shows up here): 0 (the licence had already been checked and no send was due).
- npm's own runner (npx) resolving the package at registry.npmjs.org: 8 lookups, 2 connections (not LLMGRAPH; listed apart).

## Limits

- TLS contents are not read here (the contents of what is sent were read separately on a test build); this run covers who is talked to and looked up.
- Usage counts and crash reports are only sent when due, so a send may not fall inside this window.
- Lookups that bypass the Windows DNS Client service (for example DNS over HTTPS inside a process) are not seen.

The raw capture is kept privately and is available on request to security@llmgraph.in.
