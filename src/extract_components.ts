import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

const targets = [
  { name: "scribe", search: "scribe" },
  { name: "altar", search: "altar" },
  { name: "focus", search: "focus" },
  { name: "AI_Assistant", search: "ai assistant" },
  { name: "sanctum", search: "sanctum" }
];

targets.forEach(target => {
  let idx = 0;
  let count = 0;
  const lowerBundle = bundle.toLowerCase();
  while (true) {
    idx = lowerBundle.indexOf(target.search, idx);
    if (idx === -1) break;
    
    // We want the snippet from the original bundle (preserving case)
    const start = Math.max(0, idx - 1500);
    const end = Math.min(bundle.length, idx + 2500);
    const snippet = bundle.slice(start, end);
    
    fs.writeFileSync(`extract_${target.name}_${count}.txt`, snippet);
    console.log(`Saved extract_${target.name}_${count}.txt from position ${idx}`);
    count++;
    idx += target.search.length;
    if (count >= 10) break; // Limit to first 10 matches per keyword
  }
});
