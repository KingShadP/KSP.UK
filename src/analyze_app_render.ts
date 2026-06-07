import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

// Slice the last 25000 characters which represent the custom App render section
const startIdx = Math.max(0, bundle.length - 27000);
const snippet = bundle.slice(startIdx);

fs.writeFileSync("app_render_main.txt", snippet);
console.log(`Extracted the final ${snippet.length} characters of the bundle to app_render_main.txt`);
