import { eventBus } from "../EventBus";

export type Obra = {
  titulo: string;
  autor: string;
  duracion: string;
  genero: string;
  hash: string;
  contrato: string;
  fecha: string;
};

let lote: Obra[] = [];

eventBus.on("track.processed", async (payload: any) => {
  // Map payload to Obra type if necessary
  const obra: Obra = {
    titulo: payload.metadata.title || payload.metadata.nombre,
    autor: payload.metadata.author || payload.metadata.autor,
    duracion: payload.metadata.duration || "0:00",
    genero: payload.metadata.genre || "Unknown",
    hash: payload.hash,
    contrato: payload.contrato,
    fecha: new Date().toISOString()
  };

  lote.push(obra);

  console.log(`[Batch] Added track. Current size: ${lote.length}/50`);

  await eventBus.emit("batch.progress", {
    actual: lote.length,
    objetivo: 50
  });

  if (lote.length >= 50) {
    console.log("[Batch] Batch full. Emitting batch.ready");
    await eventBus.emit("batch.ready", { lote: [...lote] });
    lote = []; // Reset batch
  }
});

eventBus.on("batch.force", async () => {
  if (lote.length > 0) {
    console.log("[Batch] Forced compilation.");
    await eventBus.emit("batch.ready", { lote: [...lote] });
    lote = []; // Reset batch
    await eventBus.emit("batch.progress", { actual: 0, objetivo: 50 });
  }
});
