import { eventBus } from "../EventBus";
import { generateAudioHash, generateSpectralHash, generateTimbreMap } from "../omni/AudioDNA";
import { generarContrato } from "../../legal/contractEngine";
import { OMNI } from "../omni/OmniCore";

eventBus.on("track.submitted", async ({ file, track }: { file: File, track: any }) => {
  try {
    console.log("[IngestionRouter] Processing track:", track.title);
    
    // 1. Generate Hash & DNA
    const hash = await generateAudioHash(file);
    const spectralHash = await generateSpectralHash(file);
    const timbreMap = await generateTimbreMap(file);

    // 2. Generate Contract
    const contrato = generarContrato({
      titulo: track.title,
      autor: track.author,
      duracion: track.duration,
      genero: track.genre
    }, hash);

    // 3. Register in OMNI (Simulated persistence)
    const entity = {
        id: hash,
        hash,
        spectralHash,
        timbreMap,
        metadata: {
            nombre: track.title,
            autor: track.author,
            sha256: hash,
            ...track
        },
        contract: contrato,
        state: 'active',
        created: Date.now(),
        safe: true,
        mastered: true, // Assuming mastered for this flow
        score: 85, // Initial score
        legal: { // Add legal metadata for the view
            titulo: track.title,
            autor: track.author,
            sha256: hash,
            formato: "WAV",
            registro: "Obra Musical"
        }
    };
    
    // @ts-ignore - Accessing private registry for demo
    OMNI.registry[hash] = entity;
    // @ts-ignore - Trigger internal update
    if (OMNI.emit) OMNI.emit("registry.updated", OMNI.registry); 

    // 4. Emit Success (Intelligence Ready)
    eventBus.emit("intelligence.ready", entity);
    
    // Keep track.processed for batch compatibility if needed, or update batch listener
    eventBus.emit("track.processed", entity);
    
    console.log("[IngestionRouter] Track processed:", hash);

  } catch (error) {
    console.error("[IngestionRouter] Error processing track:", error);
  }
});
