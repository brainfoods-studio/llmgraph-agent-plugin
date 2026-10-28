// LLMGRAPH stop check. A Stop hook.
//
// When the agent is about to end its turn, this asks the LLMGRAPH engine that is already running on this computer whether the saved edits
// left calls that are certain to break. If so, it blocks the stop once, with the list, so the agent fixes them or tells the user why each is
// fine. It blocks on nothing else: calls in a set, calls found by name, places LLMGRAPH cannot see, an engine that is not running, an
// engine that is busy or behind, an older engine, any error and any delay all let the agent stop. It never blocks twice in a row
// (`stop_hook_active`), never starts the engine, and sends nothing anywhere but the local named pipe of the user's own engine.
// Node standard library only.
//
// Off with any of: [hook] stop = "off" in the user config file; LLMGRAPH_STOP_HOOK=off; `npx -y llmgraph-mcp hook off` (this and the
// search hint); disabling the plugin in Claude Code.
import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOTAL_MS = 4500; // the whole run, whatever happens (the hook timeout in hooks.json is 6 seconds)
const REPLY_MS = 4000; // the wait for the engine, from the moment the pipe is open (the engine's own budget is 3000 ms)
const MAX_TEXT = 2000;
const PIPE = /^\\\\\.\\pipe\\llmgraph-engine-[0-9a-f]{16}(-[A-Za-z0-9]{1,16})?-p1$/;

function allow() {
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
    const m = /^(?:(hook)\.)?stop\s*=\s*["']([^"']*)["']$/.exec(line);
    if (m && (inHook || m[1] === "hook")) off = m[2].trim() === "off";
  }
  return off;
}

export function isOff(env, readFile = (p) => fs.readFileSync(p, "utf8")) {
  const v = (env.LLMGRAPH_STOP_HOOK || "").trim();
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

function ask(info, hello, gate) {
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
    sock.on("close", () => finish(null)); // an older engine closes the connection at an operation it does not know
    sock.on("connect", () => {
      sock.write(Buffer.concat([frame(hello), frame(gate)]));
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
        if (frames === 2) return finish(msg && msg.op === "gate" ? msg : null);
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

// The block, in the form Claude Code documents for Stop hooks (https://code.claude.com/docs/en/hooks#stop-decision-control).
export function blockOutput(reply) {
  if (!reply || reply.status !== "breaks" || typeof reply.text !== "string" || !reply.text) return null;
  return JSON.stringify({ decision: "block", reason: reply.text.slice(0, MAX_TEXT) });
}

async function main() {
  const t = setTimeout(allow, TOTAL_MS);
  t.unref();
  if (isOff(process.env)) return allow();
  const raw = await readStdin();
  if (!raw) return allow();
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return allow();
  }
  if (!input || input.stop_hook_active === true) return allow(); // at most one block per stop: no loops
  const cwd = typeof input.cwd === "string" ? input.cwd : "";
  if (!cwd) return allow();
  const info = findDaemon(process.env);
  if (!info) return allow();
  const hello = { op: "hello", proto: 1, client: "hint", app_version: String(info.app_version || ""), build_kind: String(info.build_kind || ""), session_pid: process.pid };
  const out = blockOutput(await ask(info, hello, { op: "gate", proto: 1, cwd }));
  if (!out) return allow();
  process.stdout.write(out + "\n", () => process.exit(0));
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch(() => allow());
}
