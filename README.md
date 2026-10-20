# LLMGRAPH plugin for Claude Code

Connects the local LLMGRAPH engine to Claude Code over MCP, and adds a skill that says when to ask each of its five questions and how to read the answers.

LLMGRAPH reads Python and TypeScript/JavaScript code on your computer and answers questions such as "who calls this?" and "what breaks if I change this?". Every answer line carries one of five labels, strongest first: `certain`, `exactly_these`, `within_these`, `maybe_more`, `cannot_see`. It never runs your code.

## Install

In your shell:

```
claude plugin marketplace add brainfoods-studio/llmgraph-agent-plugin
claude plugin install llmgraph@llmgraph
```

Or inside a Claude Code session:

```
/plugin marketplace add brainfoods-studio/llmgraph-agent-plugin
/plugin install llmgraph@llmgraph
```

The plugin starts the engine with `npx -y llmgraph-mcp` (Windows x64, Node.js 16 or later). On first use the engine shows a sign-in link; LLMGRAPH is in invite-only beta at https://beta.llmgraph.in.

## What is inside

| Path | What |
|---|---|
| `.claude-plugin/plugin.json` | plugin manifest (`llmgraph`) |
| `.claude-plugin/marketplace.json` | marketplace manifest (`llmgraph`) |
| `.mcp.json` | the MCP server `llmgraph`: `npx -y llmgraph-mcp` |
| `skills/llmgraph/SKILL.md` | when to ask which question, and how to read labels, reasons and assumptions |

Docs: https://beta.llmgraph.in/docs/ · Support: support@llmgraph.in
