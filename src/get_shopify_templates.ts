import fs from "fs";

if (!fs.existsSync("ShopifyExport.js")) {
  console.error("ShopifyExport.js does not exist!");
  process.exit(1);
}

const content = fs.readFileSync("ShopifyExport.js", "utf-8");

// We want to find the exact variable assignments.
// In the compiled code, we can see things like:
// const A = `...`
// Let's search for some of files. We'll run regex or index searches.

const snippets: { name: string; content: string }[] = [];

// Locate text blocks
function findContiguousText(patternStart: string, name: string) {
  const startIdx = content.indexOf(patternStart);
  if (startIdx === -1) {
    console.log(`Failed to find start pattern: ${patternStart}`);
    return;
  }
  
  // Find backtick end
  const quoteChar = "`";
  const strStart = content.slice(startIdx).indexOf(quoteChar);
  if (strStart === -1) {
    console.log(`Failed to find opening backtick for ${name}`);
    return;
  }
  
  const actualStrStart = startIdx + strStart + 1;
  // find matching backtick, accounting for backslash escapes
  let actualStrEnd = actualStrStart;
  while (actualStrEnd < content.length) {
    if (content[actualStrEnd] === "`" && content[actualStrEnd - 1] !== "\\") {
      break;
    }
    actualStrEnd++;
  }
  
  const textVal = content.slice(actualStrStart, actualStrEnd);
  snippets.push({ name, content: textVal });
  console.log(`Extracted template "${name}"! (${textVal.length} chars)`);
}

findContiguousText("THE SANCTUM | TACTICAL ESPIONAGE THEME", "CustomCSS");
findContiguousText('font_heading', "SettingsSchema");
findContiguousText('"color_background": "#020202"', "SettingsData");
findContiguousText("THE SANCTUM | CUSTOM CURSOR", "CustomCursor");
findContiguousText("THE SANCTUM | SCRAMBLE TEXT EFFECT", "ScrambleText");
findContiguousText("THE SANCTUM | AMBIENT MATRIX BACKGROUND", "ParticleCanvas");
findContiguousText("THE SANCTUM | MAGNETIC BUTTONS", "MagneticButtons");
findContiguousText("THE SANCTUM | BOOT SEQUENCE", "BootSequence");
findContiguousText("INTEGRATION PROTOCOL [SHOPIFY]", "IntegrationProtocol");

fs.writeFileSync("shopify_extracted_components.json", JSON.stringify(snippets, null, 2));
console.log("Extracted Shopify export modules!");
