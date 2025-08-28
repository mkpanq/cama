#!/usr/bin/env node
/*
 Creates a GitHub PR using gh. Requirements:
 - GitHub CLI installed: https://cli.github.com/
 - Authenticated: gh auth login

 Usage: npm run pr:create [-- --base main]
 - Detects current branch
 - Uses last commit message as title
 - Generates a concise body from recent commits and changed files
*/
const { execSync, spawnSync } = require("node:child_process");

function hasGh() {
  try {
    execSync("gh --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8" }).trim();
}

function main() {
  if (!hasGh()) {
    console.error(
      "GitHub CLI (gh) not found. Install from https://cli.github.com and run `gh auth login`.",
    );
    process.exit(1);
  }

  const baseArgIndex = process.argv.indexOf("--base");
  const base = baseArgIndex > -1 ? process.argv[baseArgIndex + 1] : "main";

  const branch = sh("git rev-parse --abbrev-ref HEAD");
  const lastCommitTitle = sh("git log -1 --pretty=%s");
  const lastCommitBody = sh("git log -1 --pretty=%b");

  // Collect recent commits on this branch not in base
  let commits = "";
  try {
    commits = sh(`git log ${base}..${branch} --pretty=format:%s`);
  } catch {
    // fallback to the last commit only
    commits = lastCommitTitle;
  }

  // Changed files summary
  let files = "";
  try {
    files = sh(`git diff --name-only ${base}...${branch}`);
  } catch {
    files = sh("git diff --name-only");
  }

  const title = lastCommitTitle || `PR from ${branch}`;
  const body = [
    lastCommitBody && lastCommitBody.trim() ? lastCommitBody.trim() : null,
    commits ? `Commits:\n- ` + commits.split("\n").join("\n- ") : null,
    files ? `\nChanged files:\n\n\`\n${files}\n\`` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const args = [
    "pr",
    "create",
    "--fill", // use template if present
    "--title",
    title,
    "--body",
    body,
    "--base",
    base,
    "--head",
    branch,
  ];

  const res = spawnSync("gh", args, { stdio: "inherit" });
  process.exit(res.status ?? 1);
}

main();
