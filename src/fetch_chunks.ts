import https from "https";
import fs from "fs";

function downloadFile(url: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Status code ${res.statusCode} for ${url}`);
        reject(new Error(`Status code ${res.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(outputPath);
      res.pipe(fileStream);
      fileStream.on("finish", () => {
        fileStream.close();
        console.log(`Downloaded ${url} to ${outputPath} (${fs.statSync(outputPath).size} bytes)`);
        resolve();
      });
    }).on("error", (err) => {
      console.error(`Error downloading ${url}:`, err);
      reject(err);
    });
  });
}

async function run() {
  const host = "https://kingshadp-the-sanctum-901743331063.us-west1.run.app";
  
  // Try several candidate URLs
  const candidates = [
    { url: `${host}/assets/AcquisitionGrid-4Fn6mWdi.js`, file: "AcquisitionGrid.js" },
    { url: `${host}/AcquisitionGrid-4Fn6mWdi.js`, file: "AcquisitionGrid_root.js" },
    { url: `${host}/assets/ShopifyExport-CZyhiWka.js`, file: "ShopifyExport.js" },
    { url: `${host}/ShopifyExport-CZyhiWka.js`, file: "ShopifyExport_root.js" }
  ];

  for (const c of candidates) {
    try {
      await downloadFile(c.url, c.file);
    } catch (e) {
      console.log(`Failed candidate: ${c.url}`);
    }
  }
}

run();
