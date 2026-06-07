import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

// Search for key structural terms: "altar", "scribe", "manifest", "control", "console"
// Let's print sections in the bundle that contain "altar" and "scribe" together or look like the main render layout of App.tsx
const keywords = ["altar", "scribe", "console", "dashboard", "view", "activePage", "tab"];

keywords.forEach(keyword => {
  let idx = 0;
  let count = 0;
  const lowerBundle = bundle.toLowerCase();
  while (true) {
    idx = lowerBundle.indexOf(keyword, idx);
    if (idx === -1) break;
    
    // Check if it's near some JSX patterns
    const snippet = bundle.slice(Math.max(0, idx - 300), Math.min(bundle.length, idx + 600));
    if (snippet.includes("jsx") || snippet.includes("className")) {
      console.log(`Keyword "${keyword}" at position ${idx} seems JSX-related!`);
      fs.writeFileSync(`viewport_${keyword}_${count}.txt`, bundle.slice(Math.max(0, idx - 1000), Math.min(bundle.length, idx + 1500)));
      count++;
    }
    
    idx += keyword.length + 500;
    if (count >= 5) break;
  }
});
