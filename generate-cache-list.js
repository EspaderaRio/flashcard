import fs from "fs/promises";
import path from "path";

const ROOT = "./";
const IGNORE = new Set([
  "node_modules",
  ".git",
  "generate-cache-list.js",
  "service-worker.js",
  "generated-assets.js"
]);

const assets = [];

/**
 * Recursively scan directories and collect assets
 * @param {string} dir
 */
async function scanDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if ([...IGNORE].some(ignore => fullPath.includes(ignore))) continue;

    if (entry.isDirectory()) {
      await scanDirectory(fullPath);
    } else {
      // Normalize for browsers
      assets.push(fullPath.replace(/\\/g, "/").replace(/^\.\//, "./"));
    }
  }
}

async function generate() {
  await scanDirectory(ROOT);

  // Force root and index.html to top
  const orderedAssets = ["./", "./index.html", ...assets.filter(a => a !== "./index.html")];

  const output = `
// auto-generated — do not modify manually!
const CACHE = "flashcards-v" + Date.now();

const ASSETS = ${JSON.stringify(orderedAssets, null, 2)};
`;

  await fs.writeFile("generated-assets.js", output);
  console.log("✔ Cache list generated in: generated-assets.js");
  console.log(`📦 Total assets cached: ${orderedAssets.length}`);
}

generate().catch(console.error);
