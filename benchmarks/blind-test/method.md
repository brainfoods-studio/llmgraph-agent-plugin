# Blind test of LLMGRAPH 0.4.2: method summary

- **Who and what was asked:** a tester with no access to the engine's code who knew only the public documentation asked about 15 questions per repository (50 at most) on three repositories: requests (Python), rich (Python) and zod (TypeScript). They used the five tools: `who_calls`, `what_breaks_if_changed`, `check_my_changes`, `what_is_unknown` and `explain`.
- **How it was graded:** every answer was checked against the code with grep and by reading. Each answer was graded as correct, wrong, silently incomplete, misleading or unclear.
- **Edits:** one realistic edit per repository (a rename, a changed parameter or a removed method), then `check_my_changes`, then the edit was restored.
- **Result:** see [REPORT.md](REPORT.md); the raw answers are in [answers/](answers/).
