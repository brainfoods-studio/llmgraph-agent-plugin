# Blind test of LLMGRAPH 0.4.2 (independent QA)

You are an independent QA engineer and an experienced Python and TypeScript developer. You evaluate a developer tool for AI coding agents, **LLMGRAPH**, as a user would: you know only its public documentation. Report only what you observe. A number you did not measure is `[UNVERIFIED]`.

## What you may read
- The product docs: the public docs (https://beta.llmgraph.in/docs/) (start with `start.md`, `questions\*.md`, `answers\*.md`, `messages.md`, `limits.md`).
- The three test repositories (read and grep them freely):
  - `<test folder>/requests` (Python)
  - `<test folder>/rich` (Python)
  - `<test folder>/zod` (TypeScript)

**Do NOT read** anything about how the engine works inside: only the public docs and the three repositories.

## How to ask LLMGRAPH (the stand-in for your agent's MCP client)
The tester asked through a small script that speaks MCP to the released engine: the same five tools, the same answers an agent sees.
Tools: `who_calls {"symbol":...}`, `what_breaks_if_changed {"symbol":...}`, `check_my_changes {}` (or `{"paths":[...]}`), `what_is_unknown {}`, `explain {"handle":"w1"}`. Several questions in one run share one session; a new run starts a new session (the index is kept on disk). The type checker needs a few seconds after a session starts, so like a real agent, sometimes ask one question, then do other work in the same run (several questions), and ask again later.

## Your task (about 15 questions per repo; stop at 50 questions in total)
For each repo:
1. Pick realistic targets an agent would ask about before changing code: plain functions, methods, classes, a few names that appear in many unrelated places, and a few inside dynamic code.
2. Ask `who_calls` / `what_breaks_if_changed` / `what_is_unknown` / `explain`.
3. **Check every answer against the code yourself** (grep and read). For each answer, judge:
   - **correct:** every listed caller is real, and nothing real is silently missing;
   - **wrong:** a listed caller is not real, or a label is stronger than the code allows;
   - **silently incomplete:** a real caller is missing and nothing in the answer warns of it;
   - **misleading:** true but that may make an agent do the wrong thing;
   - **unclear wording.**
4. Make ONE realistic edit per repo (for example rename a function, change a parameter, or remove a method), run `check_my_changes`, and judge whether it named what you broke. Then restore with `git checkout -- .` in that repo.
5. Note the time of every answer (the tool prints ms).

## Rules
- Never edit anything except your one edit per repo, and always restore it.
- Never install anything. Never run the repos' code or tests. Never kill processes you did not start.
- Use timeouts on every command.

## Deliverable
Write `REPORT.md`:
1. A summary table per repo: questions, correct, wrong, silently incomplete, misleading, unclear, the median and max ms.
2. Every non-correct answer: the exact question, the answer lines, what the code really shows (path:line), and why it matters to an agent.
3. The `check_my_changes` result for each edit.
4. **The 3 best answers**: unedited answer text where LLMGRAPH clearly beat what grep would give. Quote them exactly; they may be used publicly.
5. Your honest overall verdict in 5 lines: would you let your coding agent rely on it, and for what?

Final message: 6 lines max (the totals, the worst finding, and the verdict).
