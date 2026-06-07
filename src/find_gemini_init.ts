import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

const lowerBundle = bundle.toLowerCase();
const terms = ["apikey", "import.meta.env", "gemini_api_key", "google_gen_ai", "new google", "v1alpha", "gemini-3.1-flash-preview"];

terms.forEach(term => {
  let matchIdx = 0;
  while (true) {
    matchIdx = lowerBundle.indexOf(term, matchIdx);
    if (matchIdx === -1) break;
    // We only want matches in the custom code range (specifically from position 700,000 and onwards, where libraries aren't)
    if (matchIdx > 700000) {
      console.log(`Found term "${term}" at position:`, matchIdx);
      console.log(bundle.slice(matchIdx - 300, matchIdx + 400));
      console.log("-----------------------------------------");
    }
    matchIdx += term.length + 1;
  }
});
