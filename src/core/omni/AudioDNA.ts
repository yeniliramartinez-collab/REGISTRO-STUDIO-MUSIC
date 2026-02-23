export async function generateAudioHash(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateSpectralHash(file: File): Promise<string> {
  // Simulated spectral analysis (using SHA-1 on a slice for demo)
  const buffer = await file.arrayBuffer();
  const slice = buffer.slice(0, Math.min(buffer.byteLength, 1024));
  const hashBuffer = await crypto.subtle.digest('SHA-1', slice);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return "SP-" + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

export async function generateTimbreMap(file: File): Promise<number[]> {
  // Simulated timbre map (12 frequency bands)
  const seed = file.size;
  const map: number[] = [];
  for(let i=0; i<12; i++) {
      const val = Math.abs(Math.sin(seed * (i+1))) * 100;
      map.push(Math.floor(val));
  }
  return map;
}
