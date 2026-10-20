---
name: llmgraph
description: Use before changing code, after editing, and whenever an LLMGRAPH answer says maybe_more or cannot_see. Explains which of the five LLMGRAPH questions to ask and how to read the labels, reasons and assumptions.
---

# Using LLMGRAPH

LLMGRAPH answers questions about the code in this project, through five MCP tools (the `llmgraph` server). It reads Python and TypeScript/JavaScript files only. An answer says what it can prove, what is within a known set, and what it cannot see. It does not give chances.

## When to ask which question

Before changing a function, method or class:
- `who_calls <symbol>`: the places that call it, with the calls LLMGRAPH cannot see named as such.
- `what_breaks_if_changed <symbol>`: what depends on it, directly or indirectly, and what LLMGRAPH cannot see.

After editing (save the files first; it reads saved files):
- `check_my_changes`: callers you did not update, and anything LLMGRAPH cannot see. Pass `paths` to limit it to the files you edited.

When an answer says `maybe_more` or `cannot_see`:
- `what_is_unknown`: where the view is blind (dynamic calls, unknown types, unreadable files) and why.
- `explain <handle>`: the evidence behind one answer line. The handle (`w1`, `w2`, ...) comes from an answer in this session and stops working when the server restarts.

## How to read an answer

The five labels, strongest first:
- `certain`: provably exactly one function.
- `exactly_these`: a known set, and every member can run here ("all of").
- `within_these`: one of a known list; some listed members may never happen here ("one of").
- `maybe_more`: there are candidates but the door is open (type unknown, a library outside the repository).
- `cannot_see`: nothing to go on (a computed call, a file that could not be read).

Each line below `certain` carries a reason, for example `closed: repo only` or `open: dynamic call`. Treat `open` as "there may be more than listed".

An answer that relies on an assumption says so (`assumes [a]: ...`). Read it before you trust the line it marks.

A `maybe_more` or `cannot_see` line is not a "no". Look at those places yourself, or ask `what_is_unknown`, before you rely on the list. Lines marked as ruled out are ruled out by proof under the assumptions the answer lists (for example "all subclasses are in this repo"), not by guess.

Answers can be listed in full with `expand` on a handle. If an answer says it is not signed in, ask the user to open the link it shows and to approve only if they just started LLMGRAPH on this computer. Do not retry until they confirm.
