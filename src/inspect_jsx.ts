import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

// Search for any JSX strings that contain the application's unique layout blocks.
// Let's print out text that is inside `jsx(...)` or `jsxs(...)` calls that have names like "Sanctum", "Scribe", "Altar" etc.
// We'll search for where these elements are paired with tailwind classes.

const terms = ["sanctum", "altar", "scribe", "focus", "assistant", "ritual", "rune"];
const found: {term: string, index: number, snippet: string}[] = [];

terms.forEach(term => {
  let idx = 0;
  const lowerBundle = bundle.toLowerCase();
  while (true) {
    idx = lowerBundle.indexOf(term, idx);
    if (idx === -1) break;
    
    // Grab around that index and see if there are standard tailwind/react keywords nearby
    const start = Math.max(0, idx - 400);
    const end = Math.min(bundle.length, idx + 800);
    const snippet = bundle.slice(start, end);
    
    if (snippet.includes("className") || snippet.includes("children") || snippet.includes("onClick") || snippet.includes("state")) {
      found.push({
        term,
        index: idx,
        snippet: bundle.slice(idx - 1000, idx + 2000) // Much larger context for saving!
      });
    }
    
    idx += term.length + 500; // Skip ahead to find next distinct components
  }
});

console.log(`Found ${found.length} distinctive component snippets!`);
found.forEach((f, index) => {
  fs.writeFileSync(`component_snippet_${f.term}_${index}.txt`, f.snippet);
  console.log(`Saved component_snippet_${f.term}_${index}.txt (Term: ${f.term}, Pos: ${f.index})`);
});
