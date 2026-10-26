# Noisy names vs a plain text search (LLMGRAPH 0.4.1, 20 October 2026)

19 symbols on four pinned open-source repos (psf/requests 611c6162cbc4, Textualize/rich 9d8f9a372cc5, pallets/werkzeug 665e760ca632, honojs/hono 5ca49b0720755), chosen and committed before the measured runs: unique functions, common names with many definitions, overridden methods, functions passed as values and same-name pairs.

**Ground truth** was decided by reading every candidate site, independently of both tools (`data/spec.json`). Each tool was then scored against it:
- ripgrep: one naive name search, and a tuned search (`data/rg.json`);
- LLMGRAPH: the first answer and the answer with expansions (`data/llm_*.json`, ruled-out lines in `data/ruled_*.json`).

| | ripgrep, 1 search | LLMGRAPH |
|---|---|---|
| True callers found | 125 of 126 | 113 of 126 listed (85 claimed, 28 as open) |
| Wrong-call lines shown | 413 | 0 claimed wrong, plus 79 open items that were not callers (labelled `maybe_more` or `cannot_see`, never confident) |
| Non-call lines shown | 234 | 0 |

Tokens an agent reads (`data/token_classes.txt`):
- **Names that also appear in unrelated code** (9 symbols): ripgrep 12,234, LLMGRAPH 5,013 with expansions.
- **Clean, unique names** (10 symbols): ripgrep 1,966, LLMGRAPH 3,576 with expansions. **Use grep for these.**

Per-symbol tables: `data/score_tables.md`. Timings depend on the machine and were taken on a shared Windows 11 laptop (16 logical cores); cold first answers took seconds.
