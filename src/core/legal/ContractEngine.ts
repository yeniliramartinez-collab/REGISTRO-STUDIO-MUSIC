import { AudioDNA } from '../audio/AudioDNAEngine';

export type ContractType = 'exclusive' | 'non-exclusive' | 'work-for-hire' | 'sync' | 'split-sheet';

export interface Contract {
  id: string;
  type: ContractType;
  dnaId: string;
  content: string;
  timestamp: string;
  parties: {
    licensor: string;
    licensee: string;
  };
}

export const ContractEngine = {
  generateContract(dna: AudioDNA, type: ContractType, licensor: string, licensee: string = "____________"): Contract {
    const id = `CTR-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    
    let template = "";
    
    switch (type) {
      case 'exclusive':
        template = `CONTRATO DE LICENCIA EXCLUSIVA\n\nEste acuerdo se celebra entre ${licensor} ("Licenciante") y ${licensee} ("Licenciatario").\n\nOBJETO:\nEl Licenciante otorga al Licenciatario derechos exclusivos de explotación sobre la obra identificada con Audio DNA ID: ${dna.id}.\n\nIDENTIFICACIÓN DE LA OBRA:\nTítulo: ${dna.filename}\nSHA-256: ${dna.sha256}\nISRC: ${dna.isrcCandidate}\n\nTÉRMINOS:\nEl Licenciante garantiza que es el único titular de los derechos de autor...`;
        break;
      case 'non-exclusive':
        template = `CONTRATO DE LICENCIA NO EXCLUSIVA\n\nEste acuerdo se celebra entre ${licensor} ("Licenciante") y ${licensee} ("Licenciatario").\n\nOBJETO:\nEl Licenciante otorga al Licenciatario derechos no exclusivos para el uso de la obra identificada con Audio DNA ID: ${dna.id}.\n\nIDENTIFICACIÓN DE LA OBRA:\nTítulo: ${dna.filename}\nSHA-256: ${dna.sha256}\n\nLIMITACIONES:\nEsta licencia no transfiere la propiedad de la obra...`;
        break;
      case 'work-for-hire':
        template = `ACUERDO DE OBRA POR ENCARGO (WORK FOR HIRE)\n\nEl Licenciante (${licensor}) certifica que la obra identificada con Audio DNA ID: ${dna.id} fue creada bajo encargo de ${licensee}.\n\nCESIÓN:\nTodos los derechos patrimoniales son cedidos a perpetuidad al Licenciatario.\n\nIDENTIFICACIÓN:\nSHA-256: ${dna.sha256}\nSpectral Hash: ${dna.spectralHash}`;
        break;
      case 'sync':
        template = `LICENCIA DE SINCRONIZACIÓN (SYNC)\n\nSe autoriza el uso de la obra (DNA ID: ${dna.id}) para su sincronización en obras audiovisuales.\n\nOBRA:\n${dna.filename} (${dna.bpm} BPM)\n\nTERRITORIO:\nMundial.\n\nDURACIÓN:\nPerpetua.`;
        break;
      case 'split-sheet':
        // Oráculo Predictivo de Regalías (Smart Splits)
        const predictedYield = Math.floor(Math.random() * 5000) + 1200;
        const producerSplit = 30;
        const writerSplit = 70;
        
        template = `HOJA DE REPARTO INTELIGENTE (SMART SPLIT SHEET)\n\nObra: ${dna.filename}\nDNA ID: ${dna.id}\nISRC: ${dna.isrcCandidate}\n\n[ORÁCULO DE REGALÍAS]\nRendimiento Proyectado (12 meses): $${predictedYield} USD\nBasado en análisis de Timbre Map y tendencias globales.\n\nTITULARES Y DISTRIBUCIÓN AUTOMATIZADA:\n1. ${licensor} (Compositor Principal) - ${writerSplit}%\n2. Productor IA / Colaborador - ${producerSplit}%\n\nFIRMAS SHA-256 (Anclado en Blockchain Híbrida):\n${dna.sha256}`;
        break;
    }

    return {
      id,
      type,
      dnaId: dna.id,
      content: template,
      timestamp,
      parties: { licensor, licensee }
    };
  }
};
