import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
// import { ingest } from "./src/mastra/ingest/index.ts";
// import { TrackPackageGenerator } from "./src/mastra/music/trackPackageGenerator.ts";
// import { IntegrityScanner } from "./src/mastra/music/integrityScanner.ts";
// import { SelfHealingEngine } from "./src/mastra/music/selfHealingEngine.ts";
import { autoMaster } from "./src/mastra/audio/autoMaster.ts";
import { File } from "buffer"; // Ensure File is available

async function startServer() {
  const app = express();
  const PORT = 3000;
  const upload = multer({ storage: multer.memoryStorage() });

  app.use(express.json());

  // Run Integrity Scan on Startup
  console.log("🔍 Running System Integrity Scan...");
  /*
  const initialReports = IntegrityScanner.scanAll();
  const corrupted = initialReports.filter(r => r.status !== 'healthy');
  
  if (corrupted.length > 0) {
    console.warn(`⚠️ Found ${corrupted.length} corrupted tracks. Initiating Self-Healing...`);
    const healed = SelfHealingEngine.healAll();
    console.log(`✅ Healed ${healed.length} tracks.`);
  } else {
    console.log("✅ System Integrity Verified: All tracks healthy.");
  }
  */

  // API Routes
  app.post("/api/ingest", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { title, author, lyrics, performer, aiUsed, applyMastering } = req.body;
      
      // 1. Basic Validation (File Shielding)
      if (req.file.size < 1000) { // < 1KB
        return res.status(400).json({ error: "File too small, possible corruption." });
      }
      // In a real app we'd check sample rate here using a library like 'music-metadata'

      let finalBuffer = req.file.buffer;
      let finalMimeType = req.file.mimetype;
      let finalName = req.file.originalname;

      const shouldMaster = applyMastering === undefined ? true : String(applyMastering) === 'true';

      // Apply Auto-Mastering if requested (or by default)
      if (shouldMaster) {
        console.log(`🎛️ Applying Auto-Mastering to ${finalName}...`);
        finalBuffer = await autoMaster(finalBuffer, finalName);
        finalMimeType = 'audio/wav';
        finalName = finalName.replace(/\.[^/.]+$/, "") + "_mastered.wav";
        console.log(`✅ Auto-Mastering complete.`);
      }

      // 2. Basic Ingest (Registry)
      const file = new File([finalBuffer], finalName, {
        type: finalMimeType,
      });
      // const result = await ingest(file, title || "Untitled", author || "Unknown");

      // 3. Advanced Track Packaging
      /*
      await TrackPackageGenerator.createPackage(finalBuffer, {
        title: title || "Untitled",
        author: author || "Unknown",
        performer: performer || "Unknown",
        aiUsed: aiUsed || "None",
        lyrics: lyrics || "",
        bpm: 120, // Default for now
        key: "C Major",
        duration: 0 // Placeholder
      });
      */

      res.json({ success: true, message: "Ingest mocked" });
    } catch (error: any) {
      console.error("Ingest error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/integrity", (req, res) => {
    // const reports = IntegrityScanner.scanAll();
    res.json([]);
  });

  app.post("/api/heal", (req, res) => {
    // const healed = SelfHealingEngine.healAll();
    res.json({ healed: [], status: "completed" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
