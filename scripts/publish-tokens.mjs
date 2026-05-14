#!/usr/bin/env node
import { access } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { constants as fsConstants } from "node:fs";

const ROOT_DIR = process.cwd();
const CSS_FILE = path.join(ROOT_DIR, "tokens", "web", "tokens.css");

const runCommand = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      env: process.env,
      stdio: "inherit",
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} exited with code ${code ?? "unknown"}`));
    });
  });

const requireEnv = (name, value) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const run = async () => {
  const host = requireEnv("SSH_HOST", process.env.SSH_HOST?.trim());
  const user = requireEnv("SSH_USER", process.env.SSH_USER?.trim());
  const deployPath = process.env.DEPLOY_PATH?.trim() || "/home/www/code/101-web-apex/dist/assets";

  await access(CSS_FILE, fsConstants.R_OK);

  const port = process.env.SSH_PORT?.trim() || "22";
  const target = `${user}@${host}`;
  const sshArgs = ["-p", port, "-o", "StrictHostKeyChecking=yes"];

  await runCommand("ssh", [...sshArgs, target, "echo ssh_ok"]);
  await runCommand("ssh", [...sshArgs, target, `mkdir -p "${deployPath}"`]);
  await runCommand("rsync", [
    "-avz",
    "-e",
    `ssh -p ${port} -o StrictHostKeyChecking=yes`,
    CSS_FILE,
    `${target}:${deployPath}/tokens.css`,
  ]);

  console.log(`[publish:tokens] source: ${path.relative(ROOT_DIR, CSS_FILE)}`);
  console.log(`[publish:tokens] target: ${deployPath}/tokens.css`);
  console.log("[publish:tokens] complete");
};

try {
  await run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[publish:tokens] failed: ${message}`);
  process.exit(1);
}
