import fs from "fs";

if (!fs.existsSync("bundle_full.js")) {
  console.error("bundle_full.js does not exist!");
  process.exit(1);
}

const bundle = fs.readFileSync("bundle_full.js", "utf-8");

// Search for any media files or playlist items
// Look for .mp3 or .wav or words like "track" or "audio" inside quotes.
const mp3Matches = bundle.match(/"[^"\r\n]*\.mp3"|'[^'\r\n]*\.mp3'/gi) || [];
const wavMatches = bundle.match(/"[^"\r\n]*\.wav"|'[^'\r\n]*\.wav'/gi) || [];
const customUrls = bundle.match(/https?:\/\/[^"\s']*\.(mp3|wav)/gi) || [];

console.log("Found MP3 URLs/paths:", mp3Matches);
console.log("Found WAV URLs/paths:", wavMatches);
console.log("Found absolute media URLs:", customUrls);

// Let's also look for standard ambient soundtracks or track configurations
// Scan for sections where track title or label lists are defined
const matches = [];
let idx = 0;
while (true) {
  idx = bundle.indexOf("title:", idx);
  if (idx === -1) break;
  matches.push(bundle.slice(idx - 100, idx + 200));
  idx += 6;
  if (matches.length > 30) break;
}

fs.writeFileSync("found_tracks.txt", `MP3s: ${JSON.stringify(mp3Matches, null, 2)}\n\nWAVs: ${JSON.stringify(wavMatches, null, 2)}\n\nAbsolute: ${JSON.stringify(customUrls, null, 2)}\n\nTitle Matches:\n${matches.join("\n---\n")}`);
console.log("Saved results to found_tracks.txt");
