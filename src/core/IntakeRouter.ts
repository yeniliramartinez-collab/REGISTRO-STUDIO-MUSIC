import { eventBus } from "./EventBus";
import { registry } from "./IntelligenceRegistry";
import { evaluateTrack } from "./ScoringEngine";
import { generarContrato } from "../legal/contractEngine";
import { OMNI } from "./omni/OmniCore";
import { analyzeAudioDNA } from "./omni/AudioDNA";
import { LegalFactory } from "./LegalFactory";
import { AI_Disclosure, AuthorShare } from "../types";

eventBus.on("track.ingested", async ({ 
  file, 
  mastered,
  aiDisclosure, 
  shares 
}: { 
  file: File, 
  mastered?: boolean,
  aiDisclosure?: AI_Disclosure,
  shares?: AuthorShare[]
}) => {
  console.log("[IntakeRouter] Track ingested:", file.name);
  
  // 1. Register (Initial Hashing)
  const entity = await registry.register(file);
  if (mastered) {
    (entity as any).mastered = true;
  }
  registry.updateState(entity.id, "pending");

  // 2. Validate & Analyze
  eventBus.emit("track.validated", { 
    id: entity.id, 
    file, 
    aiDisclosure: aiDisclosure || { used: false, tools: [], elements: [], percentage: 0 },
    shares: shares || [{ name: "Visionary Founder", role: "author", percentage: 100, identityId: "ARKHE-001" }]
  });
});

eventBus.on("track.validated", async ({ 
  id, 
  file,
  aiDisclosure,
  shares
}: { 
  id: string, 
  file: File,
  aiDisclosure: AI_Disclosure,
  shares: AuthorShare[]
}) => {
  console.log("[IntakeRouter] Track validated:", id);
  
  // 3. Scoring
  evaluateTrack(id);
  
  // 4. Legal Factory Generation (God Level)
  try {
      const entity = registry.get(id);
      if (entity) {
          // Generate SHA-256 (already done in register, but we use it for legal docs)
          const hash = id;

          // Build Legal Pack
          const legalPack = LegalFactory.buildLegalPack(hash, "Visionary Founder", aiDisclosure, shares);
          
          // Generate Documents
          const certificate = LegalFactory.generateCertificate(entity.metadata as any, hash);
          const aiDeclaration = LegalFactory.generateAIDeclaration(aiDisclosure, hash);
          
          // Update Entity
          (entity as any).legal = legalPack;
          (entity as any).certificate = certificate;
          (entity as any).aiDeclaration = aiDeclaration;
          
          // Legacy Contract
          const contrato = generarContrato({
              titulo: entity.metadata?.title || file.name,
              autor: shares[0].name,
              duracion: "0:00",
              genero: "Unknown"
          }, id);
          (entity as any).contract = contrato;
      }
  } catch (e) {
      eventBus.emit("system.failure", { event: "legal.factory", error: e });
  }

  // 5. Advanced Analysis (Spectral/Timbre/IP)
  try {
      const { spectralHash, timbreMap, ipValidation } = await analyzeAudioDNA(file);
      
      const entity = registry.get(id);
      if (entity) {
          (entity as any).spectralHash = spectralHash;
          (entity as any).timbreMap = timbreMap;
          (entity as any).ipValidation = ipValidation;
          
          // Generate Distribution JSON
          (entity as any).distributionJson = LegalFactory.generateDistributionJSON(entity as any);

          // Sync with OMNI Core (Legacy)
          // @ts-ignore
          OMNI.registry[id] = { ...entity, state: 'active' };
      }

      registry.updateState(id, "sandbox");

  } catch (e) {
      console.warn("Advanced analysis failed", e);
      eventBus.emit("system.failure", { event: "analysis.dna", error: e });
      registry.updateState(id, "rejected");
  }
  
  // Notify UI
  const finalEntity = registry.get(id);
  eventBus.emit("intelligence.ready", finalEntity);
  
  if (finalEntity?.lifecycle_state === "sandbox") {
      eventBus.emit("track.processed", finalEntity);
  }
});

eventBus.on("system.failure", ({ event, error }) => {
  console.warn(`OMNI aisló fallo en ${event}`, error);
});
