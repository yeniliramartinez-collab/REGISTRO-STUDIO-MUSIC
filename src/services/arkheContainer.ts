export interface Intelligence {
  nombre: string;
  capacidad: string;
  score: number;
}

export const ArkheContainer = {
  inteligencias: [] as Intelligence[],

  reclutar(nombre: string, capacidad: string) {
    this.inteligencias.push({
      nombre,
      capacidad,
      score: 0
    });
  },

  evaluar() {
    this.inteligencias.forEach(i => {
      i.score = Math.random() * 10;
    });
  },

  seleccionar(): Intelligence | undefined {
    return this.inteligencias.sort((a, b) => b.score - a.score)[0];
  },
  
  getAll() {
    return this.inteligencias;
  }
};

// Initialize with some default "intelligences"
ArkheContainer.reclutar("Suno-V3", "Melodic Generation");
ArkheContainer.reclutar("ElevenLabs-Turbo", "Voice Synthesis");
ArkheContainer.reclutar("Mastra-Local", "Hybrid Processing");
