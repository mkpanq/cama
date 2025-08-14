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

// Start full walk
walk(repoRoot);

// Write markdown
if (todos.length > 0) {
  const markdown = [
    "# TODOs in Codebase",
    "",
    ...todos.map(
      (todo) =>
        `- [${todo.id}] ${todo.message}\n  [${todo.file}:${todo.line}](./${todo.file}#L${todo.line})`,
    ),
    "",
  ].join("\n");

  fs.writeFileSync(todoFilePath, markdown);
  execSync("git add TODO.md");
  console.log(`📄 TODO.md updated with ${todos.length} items.`);
} else {
  if (fs.existsSync(todoFilePath)) fs.unlinkSync(todoFilePath);
  console.log("✅ No TODOs found. Removed TODO.md.");
}
