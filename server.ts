/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const CMS_FILE_PATH = path.join(process.cwd(), "src", "data", "cmsData.json");
const CONFIG_PATH = path.join(process.cwd(), "firebase-applet-config.json");

// Initialize Firebase App & Firestore for server-side endpoints
let db: any = null;
try {
  if (fs.existsSync(CONFIG_PATH)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    if (getApps().length === 0) {
      initializeApp({
        projectId: firebaseConfig.projectId,
      });
    }
    db = getFirestore();
    // Support non-default database ID if specified
    if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") {
      db.settings({ databaseId: firebaseConfig.firestoreDatabaseId });
    }
    console.log("Firebase Admin SDK integrated successfully with database:", firebaseConfig.firestoreDatabaseId || "(default)");
  } else {
    console.warn("WARNING: firebase-applet-config.json was not found on disk. Operating in static file database fallback mode.");
  }
} catch (err: any) {
  console.error("Firebase Admin initialization failed inside server.ts:", err.message);
}

/**
 * Automates seeding empty Firestore projects with the default digital kingdom templates.
 */
async function seedFirestoreFromLocal(dbInstance: any, localData: any) {
  try {
    console.log("Initializing admin Firestore bootstrap seeding sequence...");
    
    // Seed General Settings
    await dbInstance.doc("cms/general").set(localData.general);
    
    // Seed Audio Releases
    for (const rel of localData.releases) {
      await dbInstance.doc(`releases/${rel.id}`).set(rel);
    }
    
    // Seed Lore Chapters
    for (const lr of localData.lore) {
      await dbInstance.doc(`lore/${lr.id}`).set(lr);
    }
    
    console.log("Firestore admin database seeding sequence completed cleanly.");
  } catch (err: any) {
    console.error("Failed to seed vacant Firestore records:", err.message);
  }
}

// API to fetch CMS contents (Reads from Firestore, falls back to local file and seeds Firestore if empty)
app.get("/api/cms", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!db) {
      // No database initialized - do static disk fallback
      if (fs.existsSync(CMS_FILE_PATH)) {
        const data = fs.readFileSync(CMS_FILE_PATH, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.status(404).json({ error: "CMS database file not found on disk storage." });
      }
      return;
    }

    // Attempt to pull general configurations from Firestore using admin SDK
    const generalSnap = await db.doc("cms/general").get();

    if (generalSnap.exists) {
      const general = generalSnap.data();

      // Read Releases
      const releasesSnap = await db.collection("releases").get();
      const releases = releasesSnap.docs.map((d: any) => d.data());
      releases.sort((a: any, b: any) => (a.id || "").localeCompare(b.id || ""));

      // Read Lore chapters
      const loreSnap = await db.collection("lore").get();
      const lore = loreSnap.docs.map((d: any) => d.data());
      lore.sort((a: any, b: any) => (a.num || "").localeCompare(b.num || ""));

      res.json({ general, releases, lore });
    } else {
      // vacant cloud instance -> Read local backup file and seed Firestore automatically
      console.log("Firestore 'cms/general' is empty. Seeding database with factory defaults...");
      if (fs.existsSync(CMS_FILE_PATH)) {
        const localRaw = fs.readFileSync(CMS_FILE_PATH, "utf-8");
        const localData = JSON.parse(localRaw);

        // Async seed operation
        await seedFirestoreFromLocal(db, localData);

        res.json(localData);
      } else {
        res.status(404).json({ error: "No CMS configurations found in cloud or local disk." });
      }
    }
  } catch (err: any) {
    console.error("Firestore dynamic read error, falling back to local file:", err);
    try {
      if (fs.existsSync(CMS_FILE_PATH)) {
        const data = fs.readFileSync(CMS_FILE_PATH, "utf-8");
        res.json(JSON.parse(data));
      } else {
        res.status(500).json({ error: "System failed reading CMS configuration fallback: " + err.message });
      }
    } catch (fallbackErr: any) {
      res.status(500).json({ error: "Fatal fallback error: " + fallbackErr.message });
    }
  }
});

// API to save CMS contents with passcode verification (Writes to both Firestore and local backup)
app.post("/api/cms", async (req: Request, res: Response): Promise<void> => {
  try {
    const passcode = req.headers["x-admin-passcode"];
    const expectedPasscode = process.env.ADMIN_PASSCODE || "kingshadp_admin";

    if (!passcode || passcode !== expectedPasscode) {
      res.status(401).json({ error: "ACCESS_DENIED: Invalid administrative passcode credential." });
      return;
    }

    const newCmsData = req.body;
    if (!newCmsData || typeof newCmsData !== "object" || !newCmsData.releases || !newCmsData.lore) {
      res.status(400).json({ error: "Invalid CMS database schema." });
      return;
    }

    // Save to Firestore first
    if (db) {
      console.log("Writing active administrator changes to cloud Firestore database using Admin SDK...");
      
      // Update General Setting document
      await db.doc("cms/general").set(newCmsData.general);

      // Synchronize Releases list (including clearing deleted items)
      const incomingReleaseIds = new Set(newCmsData.releases.map((r: any) => r.id));
      const currentReleasesSnap = await db.collection("releases").get();
      for (const docSnap of currentReleasesSnap.docs) {
        if (!incomingReleaseIds.has(docSnap.id)) {
          await db.doc(`releases/${docSnap.id}`).delete();
        }
      }
      for (const rel of newCmsData.releases) {
        await db.doc(`releases/${rel.id}`).set(rel);
      }

      // Synchronize Lore chapters (including clearing deleted items)
      const incomingLoreIds = new Set(newCmsData.lore.map((l: any) => l.id));
      const currentLoreSnap = await db.collection("lore").get();
      for (const docSnap of currentLoreSnap.docs) {
        if (!incomingLoreIds.has(docSnap.id)) {
          await db.doc(`lore/${docSnap.id}`).delete();
        }
      }
      for (const lr of newCmsData.lore) {
        await db.doc(`lore/${lr.id}`).set(lr);
      }
      
      console.log("Firestore cloud synchronization complete.");
    }

    // Always keep a local copy as backup & audit log
    fs.writeFileSync(CMS_FILE_PATH, JSON.stringify(newCmsData, null, 2), "utf-8");
    res.json({ success: true, message: "Sovereign CMS configuration securely written and synchronized with cloud Firestore." });
  } catch (err: any) {
    console.error("Failed to persist CMS modifications:", err);
    res.status(500).json({ error: "Failed to save CMS configuration: " + err.message });
  }
});

// Initialize secure server-side Gemini Client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("WARNING: GEMINI_API_KEY is not configured or using default placeholder key.");
    }
    // Initialize GoogleGenAI SDK
    geminiClient = new GoogleGenAI({ apiKey: key || "" });
  }
  return geminiClient;
}

// Secure shopify environment configuration readout endpoint
app.get("/api/shopify-config", (req: Request, res: Response): void => {
  const domain = process.env.SHOPIFY_DOMAIN || 
                 process.env.SHOPIFY_STORE_DOMAIN || 
                 process.env.VITE_SHOPIFY_DOMAIN || 
                 process.env.SHOPIFY_SHOP_DOMAIN || 
                 "";
  const token = process.env.SHOPIFY_TOKEN || 
                process.env.SHOPIFY_ACCESS_TOKEN || 
                process.env.SHOPIFY_STORE_ACCESS_TOKEN ||
                process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || 
                process.env.VITE_SHOPIFY_TOKEN || 
                process.env.VITE_SHOPIFY_ACCESS_TOKEN || 
                "";
  res.json({ domain: domain.trim(), token: token.trim() });
});

// REST Secure API Chat Endpoint
app.post("/api/chat", async (req: Request, res: Response): Promise<void> => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "Missing or invalid 'messages' key array." });
      return;
    }

    const ai = getGeminiClient();
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      res.json({
        text: "SECURE CHAT LINK UNAVAILABLE: Gemini API key is missing. Please add your GEMINI_API_KEY in the Secrets / Settings Panel inside the Google AI Studio interface to activate full AI Concierge intelligence operations."
      });
      return;
    }

    // Convert client-side messaging history to Gemini SDK chat parameters format
    const contents = messages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    // Invoke Gemini Content Generation with system rules
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: "You are the Executive AI Concierge for KINGSHADP, a private wealth and extreme luxury lifestyle management firm. You act as a highly competent, unflinchingly professional Chief of Staff. No flowery language, no mystical or mysterious LARP. Be precise, deferential, highly capable, and brutally efficient. Respond to the principal directly. Keep responses relatively brief and highly structured.",
        temperature: 0.4
      }
    });

    const textResponse = response.text || "Operations completed without additional text telemetry output.";
    res.json({ text: textResponse });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    res.status(500).json({ error: "System gateway communication timeout: " + (error.message || error) });
  }
});

// Mount Vite middleware for development preview, otherwise serve production build artifacts
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite development server mounted successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Production static files serving mounted.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Sanctum Server is listening securely on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server Bootstrap Crash:", err);
});
