// LLMGRAPH search hint. A PreToolUse hook for Grep. (A Glob looks for files, and LLMGRAPH's questions are about symbols, so a Glob is never answered.)
//
// Before the agent searches for a plain name, this asks the LLMGRAPH engine that is already running on this computer whether it knows
// the name, and offers its answer as extra context. It never blocks the search, never decides permission, never changes the tool input,
// never starts the engine, and says nothing when anything is missing or slow. The name travels only over the local named pipe of the
// user's own engine. Node standard library only.
//
// Off with any of: [hook] grep = "off" in the user config file; LLMGRAPH_GREP_HOOK=off; `npx -y llmgraph-mcp hook off`; disabling the
// plugin in Claude Code.
import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOTAL_MS = 280; // the whole run, whatever happens
const REPLY_MS = 250; // the wait for the engine, from the moment the pipe is open
const MAX_TEXT = 400;
const NAME = /^[A-Za-z_][A-Za-z0-9_]{2,79}(\.[A-Za-z_][A-Za-z0-9_]{2,79})?$/;
const PIPE = /^\\\\\.\\pipe\\llmgraph-engine-[0-9a-f]{16}(-[A-Za-z0-9]{1,16})?-p1$/;

function quiet() {
  process.exit(0);
}

// ---- the setting -----------------------------------------------------------------------------------------------------------
function configPath(env) {
  if (process.platform === "win32") return env.APPDATA ? path.join(env.APPDATA, "llmgraph", "config.toml") : null;
  if (process.platform === "darwin") return env.HOME ? path.join(env.HOME, "Library", "Application Support", "llmgraph", "config.toml") : null;
  if (env.XDG_CONFIG_HOME) return path.join(env.XDG_CONFIG_HOME, "llmgraph", "config.toml");
  return env.HOME ? path.join(env.HOME, ".config", "llmgraph", "config.toml") : null;
}

export function isOffInConfig(text) {
  let inHook = false;
  let off = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (line.startsWith("[")) {
      inHook = line === "[hook]";
      continue;
    }
    const m = /^(?:(hook)\.)?grep\s*=\s*["']([^"']*)["']$/.exec(line);
    if (m && (inHook || m[1] === "hook")) off = m[2].trim() === "off";
  }
  return off;
}

export function isOff(env, readFile = (p) => fs.readFileSync(p, "utf8")) {
  const v = (env.LLMGRAPH_GREP_HOOK || "").trim();
  if (v === "off") return true;
  if (v === "on") return false;
  const p = configPath(env);
  if (!p) return false;
  try {
    return isOffInConfig(readFile(p));
  } catch {
    return false;
  }
}

// ---- which patterns are names ------------------------------------------------------------------------------------------------
export function grepName(pattern) {
  if (typeof pattern !== "string" || pattern.length > 200) return null;
  let s = pattern;
  if (s.startsWith("^")) s = s.slice(1);
  if (s.startsWith("\\b")) s = s.slice(2);
  for (const kw of ["def\\s+", "def ", "class\\s+", "class ", "function "]) {
    if (s.startsWith(kw)) {
      s = s.slice(kw.length);
      break;
    }
  }
  for (const tail of ["\\b", "\\(", "(", "$"]) {
    if (s.endsWith(tail)) {
      s = s.slice(0, -tail.length);
      break;
    }
  }
  return NAME.test(s) ? s : null;
}

export function nameOf(toolName, toolInput) {
  if (!toolInput || typeof toolInput !== "object") return null;
  if (toolName === "Grep") return grepName(toolInput.pattern);
  return null;
}

// ---- the engine ----------------------------------------------------------------------------------------------------------------
function frame(obj) {
  const body = Buffer.from(JSON.stringify(obj), "utf8");
  const head = Buffer.alloc(4);
  head.writeUInt32LE(body.length, 0);
  return Buffer.concat([head, body]);
}

function findDaemon(env) {
  const local = env.LOCALAPPDATA;
  if (process.platform !== "win32" || !local) return null; // the engine daemon is a Windows program in this release
  let info;
  try {
    info = JSON.parse(fs.readFileSync(path.join(local, "llmgraph", "engine", "daemon.json"), "utf8"));
  } catch {
    return null;
  }
  if (!info || info.proto !== 1 || !Number.isInteger(info.pid) || typeof info.pipe !== "string" || !PIPE.test(info.pipe)) return null;
  try {
    process.kill(info.pid, 0); // only asks whether the process exists
  } catch (e) {
    if (e && e.code !== "EPERM") return null;
  }
  return info;
}

function ask(info, hello, hint) {
  return new Promise((resolve) => {
    let buf = Buffer.alloc(0);
    let frames = 0;
    let done = false;
    const finish = (v) => {
      if (done) return;
      done = true;
      try {
        sock.destroy();
      } catch {
        /* nothing to do */
      }
      resolve(v);
    };
    const sock = net.connect(info.pipe);
    const timer = setTimeout(() => finish(null), REPLY_MS);
    timer.unref();
    sock.on("error", () => finish(null));
    sock.on("close", () => finish(null));
    sock.on("connect", () => {
      sock.write(Buffer.concat([frame(hello), frame(hint)]));
    });
    sock.on("data", (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      for (;;) {
        if (buf.length < 4) return;
        const n = buf.readUInt32LE(0);
        if (n > 1048576) return finish(null);
        if (buf.length < 4 + n) return;
        let msg;
        try {
          msg = JSON.parse(buf.subarray(4, 4 + n).toString("utf8"));
        } catch {
          return finish(null);
        }
        buf = buf.subarray(4 + n);
        frames += 1;
        if (frames === 1 && !(msg && msg.op === "ok")) return finish(null);
        if (frames === 2) return finish(msg && msg.op === "hint" && typeof msg.text === "string" ? msg.text : null);
      }
    });
  });
}

function readStdin() {
  return new Promise((resolve) => {
    const parts = [];
    let size = 0;
    process.stdin.on("data", (c) => {
      size += c.length;
      if (size > 1048576) return resolve(null);
      parts.push(c);
    });
    process.stdin.on("end", () => resolve(Buffer.concat(parts).toString("utf8")));
    process.stdin.on("error", () => resolve(null));
  });
}

export function reply(text, event) {
  return JSON.stringify({ hookSpecificOutput: { hookEventName: event === "PostToolUse" ? "PostToolUse" : "PreToolUse", additionalContext: text } });
}

async function main() {
  const t = setTimeout(quiet, TOTAL_MS);
  t.unref();
  if (isOff(process.env)) return quiet();
  const raw = await readStdin();
  if (!raw) return quiet();
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return quiet();
  }
  const name = nameOf(input && input.tool_name, input && input.tool_input);
  if (!name) return quiet();
  const cwd = typeof input.cwd === "string" ? input.cwd : "";
  if (!cwd) return quiet();
  const info = findDaemon(process.env);
  if (!info) return quiet();
  const toolPath = input.tool_input && typeof input.tool_input.path === "string" ? input.tool_input.path : null;
  const hello = { op: "hello", proto: 1, client: "hint", app_version: String(info.app_version || ""), build_kind: String(info.build_kind || ""), session_pid: process.pid };
  const text = await ask(info, hello, {
    op: "hint",
    cwd,
    path: toolPath,
    name,
    session_id: typeof input.session_id === "string" ? input.session_id.slice(0, 200) : "",
  });
  if (!text) return quiet();
  process.stdout.write(reply(text.slice(0, MAX_TEXT), input.hook_event_name) + "\n", () => process.exit(0));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch(() => quiet());
}
