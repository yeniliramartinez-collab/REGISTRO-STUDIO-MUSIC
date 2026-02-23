export function buildMetadata(track: any, hash: string) {
  return {
    titulo: track.title,
    autor: track.author,
    fecha: new Date().toISOString(),
    sha256: hash,
    formato: "WAV",
    registro: "Obra Musical"
  };
}
