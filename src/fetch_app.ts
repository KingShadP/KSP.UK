import https from "https";
import fs from "fs";

const url = "https://kingshadp-the-sanctum-901743331063.us-west1.run.app/assets/index-CeJz-RLS.js";

https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    console.log("Downloaded size:", data.length);
    
    // Let's search for interesting strings
    // We can regex search for titles, labels, states, text content, and react component definitions.
    // E.g., we can extract text matches inside quotes that look like words
    const matches = data.match(/"[^"\r\n]{3,100}"|'[^'\r\n]{3,100}'/g);
    if (matches) {
       console.log("Total string matches found:", matches.length);
       // Filter strings containing readable english-like names or text
       const readableStrings = matches
         .map(s => s.slice(1, -1))
         .filter(s => /^[A-Za-z0-9\s.,?!'\-()]{4,100}$/.test(s));
       
       fs.writeFileSync("extracted_strings.txt", readableStrings.join("\n"));
       console.log("Saved readable strings to extracted_strings.txt");
    }
    
    // Also save a small slice of the first and last 5000 characters
    fs.writeFileSync("js_header.txt", data.slice(0, 8000));
    fs.writeFileSync("js_footer.txt", data.slice(-8000));
    
    // Let's also do a more targeted search inside the bundle for react parts
    // Let's write the whole file but split or slice it into 64KB pieces if we want, or do a search.
    // Let's search for some prominent words.
    const keywords = ["Focus", "Journal", "Breathing", "Session", "Oracle", "Scribe", "Sanctum", "Aura", "Meditation", "Ritual", "Rune", "Chamber", "Altar", "Tarot"];
    const foundKeywords = keywords.filter(kw => data.toLowerCase().includes(kw.toLowerCase()));
    console.log("Found keywords inside bundle:", foundKeywords);
  });
}).on("error", (err) => {
  console.error("HTTP Get Error:", err);
});
