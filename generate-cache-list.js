import fs from "fs";
import path from "path";

const ROOT = "./";
const IGNORE = new Set([
  "node_modules",
  ".git",
  "generate-cache-list.js",
  "service-worker.js"
]);

const assets = [];

/**
 * Recursively scan a directory and collect file paths
 * @param {string} dir
 */
function scanDirectory(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);

    if ([...IGNORE].some(ignore => fullPath.includes(ignore))) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      // Normalize paths for cross-platform compatibility
      assets.push(fullPath.replace(/\\/g, "/").replace(/^\.\//, "./"));
    }
  }
}

// Start scanning
scanDirectory(ROOT);

// Ensure root and index.html are first
const orderedAssets = ["./", "./index.html", ...assets.filter(a => a !== "./index.html")];

// Generate the output JS
const output = `
// auto-generated — do not modify manually!
const CACHE = "flashcards-v" + Date.now();

const ASSETS = ${JSON.stringify(orderedAssets, null, 2)};
`;

fs.writeFileSync("generated-assets.js", output);

console.log("✔ Cache list generated in: generated-assets.js");
console.log(`📦 Total assets cached: ${orderedAssets.length}`);
