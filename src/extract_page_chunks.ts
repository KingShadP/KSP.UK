import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");
const lowerBundle = bundle.toLowerCase();

// Search for imports or mentions of these filenames
const chunks = ["AcquisitionGrid", "ShopifyExport"];

chunks.forEach(chunkName => {
  let idx = 0;
  console.log(`=== SEARCHING FOR CHUNK: ${chunkName} ===`);
  while (true) {
    idx = lowerBundle.indexOf(chunkName.toLowerCase(), idx);
    if (idx === -1) break;
    console.log(`Found mention of ${chunkName} at pos ${idx}:`);
    console.log(bundle.slice(Math.max(0, idx - 400), Math.min(bundle.length, idx + 1000)));
    console.log("---------------------------------------");
    idx += chunkName.length + 500;
  }
});
