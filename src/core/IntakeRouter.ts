import { eventBus } from "./EventBus";
import { registry } from "./IntelligenceRegistry";
import { evaluateTrack } from "./ScoringEngine";
import { generarContrato } from "../legal/contractEngine";
import { OMNI } from "./omni/OmniCore";

// Re-integrate existing logic
import { generateSpectralHash, generateTimbreMap } from "./omni/AudioDNA";

eventBus.on("track.ingested", async ({ file }: { file: File }) => {
  console.log("[IntakeRouter] Track ingested:", file.name);
  
  // 1. Register (Hashing)
  const entity = await registry.register(file);
  registry.updateState(entity.id, "pending");

  // 2. Validate & Analyze
  eventBus.emit("track.validated", { id: entity.id, file });
});

eventBus.on("track.validated", async ({ id, file }: { id: string, file: File }) => {
  console.log("[IntakeRouter] Track validated:", id);
  
  // 3. Scoring
  evaluateTrack(id);
  
  // 4. Advanced Analysis (Spectral/Timbre) - Integrating previous work
  try {
      const spectralHash = await generateSpectralHash(file);
      const timbreMap = await generateTimbreMap(file);
      
      // Update entity with advanced data
      const entity = registry.get(id);
      if (entity) {
          (entity as any).spectralHash = spectralHash;
          (entity as any).timbreMap = timbreMap;
      }
  } catch (e) {
      console.warn("Advanced analysis failed, proceeding with basic", e);
  }

  // 5. Contract Generation (Legacy Integration)
  try {
      const entity = registry.get(id);
      if (entity && entity.metadata) {
           const contrato = generarContrato({
              titulo: entity.metadata.title,
              autor: "Visionary Founder", // Default for now
              duracion: "0:00",
              genero: "Unknown"
          }, id);
          (entity as any).contract = contrato;
          
          // Sync with OMNI Core (Legacy)
          // @ts-ignore
          OMNI.registry[id] = { ...entity, state: 'active' };
      }
  } catch (e) {
      eventBus.emit("system.failure", { event: "contract.generation", error: e });
  }

  registry.updateState(id, "sandbox");
  
  // Notify UI
  const finalEntity = registry.get(id);
  eventBus.emit("intelligence.ready", finalEntity);
  
  // Trigger Batch (Legacy)
  eventBus.emit("track.processed", finalEntity);
});

eventBus.on("system.failure", ({ event, error }) => {
  console.warn(`OMNI aisló fallo en ${event}`, error);
});
