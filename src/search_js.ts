import fs from "fs";

// Load the downloaded bundle and find references
const url = "https://kingshadp-the-sanctum-901743331063.us-west1.run.app/assets/index-CeJz-RLS.js";
// Wait, we didn't save the full file in fetch_app.ts! We only saved header, footer, and extracted strings.
// Let's modify fetch_app.ts to download the full file locally first, or just read it directly here in search_js.ts!

import https from "https";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Loaded bundle length:", data.length);
    
    // Write full bundle to a local file for searching if we want
    fs.writeFileSync("bundle_full.js", data);
    
    // Find all occurrences of "Scribe" and "Altar"
    const terms = ["scribe", "altar", "focus", "session", "chamber", "rune", "sanctum"];
    
    const results: string[] = [];
    terms.forEach(term => {
      let idx = 0;
      while (true) {
        idx = data.toLowerCase().indexOf(term, idx);
        if (idx === -1) break;
        
        // Extract 300 characters before and after this occurrence for inspection
        const start = Math.max(0, idx - 200);
        const end = Math.min(data.length, idx + 200);
        const snippet = data.slice(start, end);
        results.push(`=== OCCURRENCE OF "${term}" AT POS ${idx} ===\n...${snippet}...\n`);
        
        idx += term.length; // move forward
        if (results.length > 100) break; // cap search results to avoid massive files
      }
    });
    
    fs.writeFileSync("keyword_context.txt", results.join("\n"));
    console.log("Saved keyword contexts to keyword_context.txt");
  });
});
