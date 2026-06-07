import fs from "fs";

if (!fs.existsSync("ShopifyExport.js")) {
  console.log("No ShopifyExport.js found!");
  process.exit(1);
}

const js = fs.readFileSync("ShopifyExport.js", "utf-8");

// Search for any backtick string
const regex = /`([^`\\]|\\.)*`/g;
let match;
const results: { index: number; sample: string; length: number; full: string }[] = [];

while ((match = regex.exec(js)) !== null) {
  const fullStr = match[0].slice(1, -1); // strip backticks
  if (fullStr.includes("THE SANCTUM") || fullStr.includes("INTEGRATION PROTOCOL") || fullStr.includes("settings_schema") || fullStr.includes("font_heading") || fullStr.includes("color_background")) {
    results.push({
      index: match.index,
      sample: fullStr.slice(0, 120),
      length: fullStr.length,
      full: fullStr
    });
  }
}

console.log(`Found ${results.length} backtick strings with search text.`);
fs.writeFileSync("shopify_raw_variables.json", JSON.stringify(results, null, 2));
console.log("Written all raw variables to shopify_raw_variables.json");
