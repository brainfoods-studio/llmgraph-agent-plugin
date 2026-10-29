# Installing LLMGRAPH (for AI agents)

LLMGRAPH is a local MCP server that answers a coding agent's questions about the user's code: who calls this, what breaks if it changes, which callers an edit missed, what it can't see, and why it said so. Every answer line is labelled by how far it is proven.

## Before you start
- **Windows x64 only** for now. On macOS or Linux, stop and tell the user it is not available yet.
- Node.js 16 or later must be on the PATH (`node --version`).
- The project must be Python or TypeScript/JavaScript.

## 1. Add the server
Add this entry to the MCP settings (stdio). On Windows, start it through `cmd /c`:

```json
{
  "mcpServers": {
    "llmgraph": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "llmgraph-mcp"]
    }
  }
}
```

## 2. The user signs in once
The first question returns a sign-in link and a short code. Ask the user to open the full link (including everything after `#`), sign in with Google, check the code matches, and approve the device. They can also run `npx -y llmgraph-mcp login` in a terminal. The beta is invite-only: if the account has no invite, point the user to https://beta.llmgraph.in/?ref=cline (invites go out within minutes). A 7-day trial starts when the first device is approved.

## 3. Check it works
List the server's tools. You should see `who_calls`, `what_breaks_if_changed`, `check_my_changes`, `what_is_unknown` and `explain`. Read every label and every cannot-see line in an answer.

Docs: https://beta.llmgraph.in/docs/start/ · Support: support@llmgraph.in
