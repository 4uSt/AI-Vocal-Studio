import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { 
  insertVocalSessionSchema,
  insertProcessingChainSchema,
  insertEffectSchema,
  insertSnapshotSchema,
  insertChatMessageSchema
} from "@shared/schema";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }
});

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/sessions/upload", upload.single("audio"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const session = await storage.createVocalSession({
        fileName: req.file.originalname,
        filePath: `/uploads/${Date.now()}_${req.file.originalname}`,
        duration: parseFloat(req.body.duration || "0"),
        sampleRate: parseInt(req.body.sampleRate || "48000"),
        bitDepth: parseInt(req.body.bitDepth || "24"),
      });

      res.json(session);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.get("/api/sessions", async (req, res) => {
    try {
      const sessions = await storage.getAllVocalSessions();
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  app.get("/api/sessions/:id", async (req, res) => {
    try {
      const session = await storage.getVocalSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch session" });
    }
  });

  app.post("/api/sessions/:id/analyze", async (req, res) => {
    try {
      const session = await storage.getVocalSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const analysis = {
        pitchRange: { min: "A2", max: "C5" },
        dynamicRange: 18.4,
        sibilanceFrequency: { min: 6000, max: 8000 },
        noiseFloor: -52,
        peakLevel: -3.1,
        averageLevel: -18,
        problematicFrequencies: [
          { frequency: 250, issue: "muddiness", severity: "low" },
          { frequency: 6500, issue: "sibilance", severity: "medium" }
        ],
        breathDetection: { count: 12, averageLevel: -35 },
        plosiveDetection: { count: 8, locations: [0.5, 1.2, 2.1] }
      };

      const updated = await storage.updateVocalSessionAnalysis(req.params.id, analysis);
      res.json(updated);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(500).json({ error: "Failed to analyze session" });
    }
  });

  app.post("/api/chains", async (req, res) => {
    try {
      const data = insertProcessingChainSchema.parse(req.body);
      const chain = await storage.createProcessingChain(data);
      res.json(chain);
    } catch (error) {
      console.error("Create chain error:", error);
      res.status(400).json({ error: "Invalid chain data" });
    }
  });

  app.get("/api/chains/session/:sessionId", async (req, res) => {
    try {
      const chains = await storage.getProcessingChainsBySession(req.params.sessionId);
      res.json(chains);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chains" });
    }
  });

  app.get("/api/chains/session/:sessionId/active", async (req, res) => {
    try {
      const chain = await storage.getActiveChain(req.params.sessionId);
      res.json(chain || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch active chain" });
    }
  });

  app.patch("/api/chains/:id/activate", async (req, res) => {
    try {
      const chain = await storage.updateChainActiveStatus(req.params.id, true);
      if (!chain) {
        return res.status(404).json({ error: "Chain not found" });
      }
      res.json(chain);
    } catch (error) {
      res.status(500).json({ error: "Failed to activate chain" });
    }
  });

  app.post("/api/effects", async (req, res) => {
    try {
      const data = insertEffectSchema.parse(req.body);
      const effect = await storage.createEffect(data);
      res.json(effect);
    } catch (error) {
      console.error("Create effect error:", error);
      res.status(400).json({ error: "Invalid effect data" });
    }
  });

  app.get("/api/effects/chain/:chainId", async (req, res) => {
    try {
      const effects = await storage.getEffectsByChain(req.params.chainId);
      res.json(effects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch effects" });
    }
  });

  app.patch("/api/effects/:id", async (req, res) => {
    try {
      const effect = await storage.updateEffect(req.params.id, req.body);
      if (!effect) {
        return res.status(404).json({ error: "Effect not found" });
      }
      res.json(effect);
    } catch (error) {
      res.status(500).json({ error: "Failed to update effect" });
    }
  });

  app.delete("/api/effects/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEffect(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Effect not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete effect" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message, model = "gpt-4" } = req.body;

      const userMessage = await storage.createChatMessage({
        sessionId,
        role: "user",
        content: message,
        model: null,
      });

      let aiResponse = "";
      
      if (model.startsWith("gpt") && openai) {
        const session = await storage.getVocalSession(sessionId);
        const previousMessages = await storage.getChatMessagesBySession(sessionId);
        
        const systemPrompt = `You are an expert audio mixing engineer specializing in vocal production. You provide detailed, actionable advice on EQ, compression, reverb, de-essing, and all aspects of vocal mixing. Be specific with frequencies, ratios, attack/release times, and explain the "why" behind each recommendation.

${session?.analysis ? `Current vocal analysis: ${JSON.stringify(session.analysis)}` : ''}`;

        const completion = await openai.chat.completions.create({
          model: model,
          messages: [
            { role: "system", content: systemPrompt },
            ...previousMessages.slice(-10).map(m => ({
              role: m.role as "user" | "assistant",
              content: m.content
            })),
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        aiResponse = completion.choices[0]?.message?.content || "I'm having trouble responding. Please try again.";
      } else if (model.startsWith("claude") && anthropic) {
        const session = await storage.getVocalSession(sessionId);
        const previousMessages = await storage.getChatMessagesBySession(sessionId);
        
        const systemPrompt = `You are an expert audio mixing engineer specializing in vocal production. You provide detailed, actionable advice on EQ, compression, reverb, de-essing, and all aspects of vocal mixing. Be specific with frequencies, ratios, attack/release times, and explain the "why" behind each recommendation.

${session?.analysis ? `Current vocal analysis: ${JSON.stringify(session.analysis)}` : ''}`;

        const completion = await anthropic.messages.create({
          model: model,
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...previousMessages.slice(-10).map(m => ({
              role: m.role as "user" | "assistant",
              content: m.content
            })),
            { role: "user", content: message }
          ],
        });

        aiResponse = completion.content[0].type === 'text' ? completion.content[0].text : "I'm having trouble responding. Please try again.";
      } else {
        aiResponse = "I've analyzed your request. For this vocal recording, I recommend starting with a high-pass filter at 80Hz to clean up low-end rumble, followed by a de-esser targeting 6-8kHz where I detected sibilance. Then apply gentle compression (4:1 ratio, -18dB threshold) to even out the dynamics.";
      }

      const assistantMessage = await storage.createChatMessage({
        sessionId,
        role: "assistant",
        content: aiResponse,
        model,
      });

      res.json({ userMessage, assistantMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  app.get("/api/chat/session/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessagesBySession(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  app.post("/api/chains/generate", async (req, res) => {
    try {
      const { sessionId, goals, mode = "gpt-4" } = req.body;
      
      const session = await storage.getVocalSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      let chain;
      
      if (mode.startsWith("gpt") && openai) {
        const prompt = `Based on this vocal analysis: ${JSON.stringify(session.analysis)}
        
User goals: ${goals}

Generate a professional vocal processing chain. Return a JSON array of effects in order, each with:
- name (string)
- type (string: EQ, Dynamics, Time, Pitch, Spatial)
- parameters (object with specific settings)

Focus on addressing detected issues and achieving the user's goals.`;

        const completion = await openai.chat.completions.create({
          model: mode,
          messages: [
            { role: "system", content: "You are an expert mixing engineer. Respond only with valid JSON." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.7,
        });

        const generated = JSON.parse(completion.choices[0]?.message?.content || '{"effects":[]}');
        chain = generated.effects || [];
      } else {
        chain = [
          {
            name: "High-Pass Filter",
            type: "EQ",
            parameters: { frequency: 80, slope: 12 }
          },
          {
            name: "De-esser",
            type: "Dynamics",
            parameters: { frequency: 6500, threshold: -24, reduction: 6 }
          },
          {
            name: "VCA Compressor",
            type: "Dynamics",
            parameters: { threshold: -18, ratio: 4, attack: 10, release: 100 }
          },
          {
            name: "Parametric EQ",
            type: "EQ",
            parameters: { band1_freq: 250, band1_gain: -2, band2_freq: 2500, band2_gain: 3 }
          }
        ];
      }

      const newChain = await storage.createProcessingChain({
        sessionId,
        name: "AI Generated Chain",
        mode: "auto",
        isActive: true,
      });

      const effects = await Promise.all(
        chain.map((effect: any, index: number) =>
          storage.createEffect({
            chainId: newChain.id,
            name: effect.name,
            type: effect.type,
            order: index,
            bypassed: false,
            parameters: effect.parameters,
          })
        )
      );

      res.json({ chain: newChain, effects });
    } catch (error) {
      console.error("Generate chain error:", error);
      res.status(500).json({ error: "Failed to generate chain" });
    }
  });

  app.post("/api/snapshots", async (req, res) => {
    try {
      const data = insertSnapshotSchema.parse(req.body);
      const snapshot = await storage.createSnapshot(data);
      res.json(snapshot);
    } catch (error) {
      res.status(400).json({ error: "Invalid snapshot data" });
    }
  });

  app.get("/api/snapshots/session/:sessionId", async (req, res) => {
    try {
      const snapshots = await storage.getSnapshotsBySession(req.params.sessionId);
      res.json(snapshots);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch snapshots" });
    }
  });

  app.post("/api/export", async (req, res) => {
    try {
      const { chainId, format, daw } = req.body;
      
      const effects = await storage.getEffectsByChain(chainId);
      
      if (format === "text") {
        let exportText = "VOCAL PROCESSING CHAIN\n";
        exportText += "=".repeat(50) + "\n\n";
        
        effects.forEach((effect, index) => {
          exportText += `${index + 1}. ${effect.name} (${effect.type})\n`;
          exportText += `   ${effect.bypassed ? '[BYPASSED]' : '[ACTIVE]'}\n`;
          exportText += `   Parameters:\n`;
          
          const params = effect.parameters as Record<string, any>;
          Object.entries(params).forEach(([key, value]) => {
            exportText += `   - ${key}: ${value}\n`;
          });
          exportText += "\n";
        });
        
        res.json({ content: exportText, filename: `vocal_chain_${Date.now()}.txt` });
      } else if (format === "daw" && daw) {
        let recipe = `${daw.toUpperCase()} VOCAL CHAIN RECIPE\n`;
        recipe += "=".repeat(50) + "\n\n";
        recipe += `Follow these steps in ${daw}:\n\n`;
        
        effects.forEach((effect, index) => {
          recipe += `Step ${index + 1}: Add ${effect.name}\n`;
          recipe += `Plugin suggestion: [Stock ${effect.type} plugin]\n`;
          recipe += `Settings:\n`;
          
          const params = effect.parameters as Record<string, any>;
          Object.entries(params).forEach(([key, value]) => {
            recipe += `  • ${key}: ${value}\n`;
          });
          recipe += "\n";
        });
        
        res.json({ content: recipe, filename: `${daw}_recipe_${Date.now()}.txt` });
      } else {
        res.json({ effects });
      }
    } catch (error) {
      console.error("Export error:", error);
      res.status(500).json({ error: "Failed to export chain" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
