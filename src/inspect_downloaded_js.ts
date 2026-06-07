import fs from "fs";

function extractSnippet(filePath: string, searchTerms: string[], outTxtName: string) {
  if (!fs.existsSync(filePath)) {
    console.log(`${filePath} does not exist.`);
    return;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  console.log(`Analyzing ${filePath} (${content.length} bytes)...`);
  
  const matches: string[] = [];
  const lowerContent = content.toLowerCase();
  
  searchTerms.forEach(term => {
    let idx = 0;
    while (true) {
      idx = lowerContent.indexOf(term.toLowerCase(), idx);
      if (idx === -1) break;
      const start = Math.max(0, idx - 400);
      const end = Math.min(content.length, idx + 800);
      matches.push(`=== TERM: "${term}" IN ${filePath} ===\n${content.slice(start, end)}\n---------------------------------\n`);
      idx += term.length + 500;
      if (matches.length > 20) break;
    }
  });
  
  fs.writeFileSync(outTxtName, matches.join("\n"));
  console.log(`Written matches for ${filePath} to ${outTxtName}`);
}

extractSnippet("AcquisitionGrid.js", ["VAULT INDEX", "Mle", "val", "restricted", "img", "selected", "onClick"], "acquisition_grid_inspect.txt");
extractSnippet("ShopifyExport.js", ["theme", "export", "store", "shopify", "download", "purchase", "button", "onClick"], "shopify_export_inspect.txt");
