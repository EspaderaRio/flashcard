const fs = require("fs");
const path = require("path");

const ROOT = "./";
const IGNORE = [
  "node_modules",
  ".git",
  "generate-cache-list.js",
  "service-worker.js"
];

let assets = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);

    if (IGNORE.some(ignore => fullPath.includes(ignore))) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      assets.push(fullPath.replace(/\\/g, "/").replace("./", "./"));
    }
  }
}

scanDirectory(ROOT);

// Force index.html & root at top
assets = ["./", "./index.html", ...assets.filter(a => a !== "./index.html")];

const output = `
const CACHE = "flashcards-v" + Date.now();

const ASSETS = ${JSON.stringify(assets, null, 2)};

// auto-generated — do not modify manually!
`;

fs.writeFileSync("generated-assets.js", output);

console.log("✔ Cache list generated in: generated-assets.js");
console.log(`📦 Total assets cached: ${assets.length}`);
