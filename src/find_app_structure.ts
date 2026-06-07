import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

// Search the bundle for specific parts of the layout.
// Let's find files that mention grid or flex panels which construct the main dashboard screen:
const keywords = [
  "grid-cols-2", "grid-cols-4", "flex-col md:flex-row", "w-[280px]", "w-[300px]",
  "altar", "scribe", "oracle", "concierge", "system uplink", "executive module"
];

const results: string[] = [];

keywords.forEach(kw => {
  let idx = 0;
  const lowerBundle = bundle.toLowerCase();
  while (true) {
    idx = lowerBundle.indexOf(kw.toLowerCase(), idx);
    if (idx === -1) break;
    
    // Extract a 1200 char snippet
    const snippet = bundle.slice(Math.max(0, idx - 600), Math.min(bundle.length, idx + 800));
    results.push(`=== PATTERN MATCH: "${kw}" AT POS ${idx} ===\n${snippet}\n----------------------`);
    idx += kw.length + 500;
    if (results.length > 50) break;
  }
});

fs.writeFileSync("app_grid_search.txt", results.join("\n"));
console.log("Saved grids and layout positions to app_grid_search.txt");
