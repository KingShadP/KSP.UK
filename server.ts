/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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
