const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const repoRoot = process.cwd();
const todoFilePath = path.join(repoRoot, "TODO.md");
const ignoredDirs = ["node_modules", ".git", "dist", "build", ".next", "out"];
const allowedExtensions = [".js", ".ts", ".tsx", ".jsx", ".mjs", ".cjs"];

const todos = [];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!ignoredDirs.includes(entry.name)) {
        walk(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(fullPath);
      if (allowedExtensions.includes(ext)) {
        parseFile(fullPath);
      }
    }
  }
}

function parseFile(filePath) {
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");

  lines.forEach((line, index) => {
    const match = line.match(/TODO[:\s](.*)/i);
    if (match) {
      const message = match[1].trim();
      const relativePath = path.relative(repoRoot, filePath);
      const id =
        "TODO-" +
        crypto
          .createHash("md5")
          .update(relativePath + message)
          .digest("hex")
          .slice(0, 6);

      todos.push({
        id,
        message,
        file: relativePath,
        line: index + 1,
      });
    }
  });
}

walk(repoRoot);

if (todos.length > 0) {
  const markdown = ["# TODOs in Codebase", ""];

  todos.forEach((todo) => {
    const fileLabel = `${todo.file}:${todo.line}`;
    const link = `./${todo.file}#L${todo.line}`;

    markdown.push(`### [${todo.id}]`);
    markdown.push(`${todo.message}`);
    markdown.push(`File: [${fileLabel}](${link})`);
    markdown.push("");
  });

  fs.writeFileSync(todoFilePath, markdown.join("\n"));

  // Automatically add TODO.md to staging
  execSync(`git add ${todoFilePath}`);

  console.log(
    `📄 TODO.md updated with ${todos.length} items and staged for commit.`,
  );
} else {
  if (fs.existsSync(todoFilePath)) {
    fs.unlinkSync(todoFilePath);
    console.log("🧹 No TODOs found. Removed existing TODO.md.");
  } else {
    console.log("✅ No TODOs found.");
  }
}
