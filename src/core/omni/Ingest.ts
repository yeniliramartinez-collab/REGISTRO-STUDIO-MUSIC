import { OMNI } from './OmniCore';
import { generateAudioHash } from './AudioDNA';
import { BMIService } from '../../services/bmiService';
import { ContractEngine } from '../legal/ContractEngine';

export async function ingestArchivo(file: File) {
  try {
    // 1. Generate Audio DNA (Sandbox & Analysis)
    const id = await generateAudioHash(file);
    const intel = OMNI.registry[id];

    // 2. Legal Pack Builder (Automatic Generation)
    const workData = {
        titulo: intel.metadata.nombre.replace(/\.[^/.]+$/, ""), // Remove extension
        autor: "Visionary Founder", // Default, could be dynamic
        duracion: "3:45", // Simulated
        genero: "Hybrid",
        idioma: "Instrumental"
    };

    // Generate BMI Pack
    const bmiPack = await BMIService.generarPaqueteBMI(workData);
    
    // Generate Contracts
    const dnaForContract = {
        id: id,
        sha256: intel.metadata.sha256,
        spectralHash: intel.metadata.spectralHash,
        timbreMap: "TIMBRE-MAP-GEN",
        bpm: intel.metadata.bpm,
        isrcCandidate: intel.metadata.isrcCandidate,
        timestamp: new Date(intel.created).toISOString(),
        filename: intel.metadata.nombre,
        size: intel.metadata.tamaño,
        format: intel.metadata.tipo
    };

    const exclusiveContract = ContractEngine.generateContract(dnaForContract, 'exclusive', workData.autor);
    const splitSheet = ContractEngine.generateContract(dnaForContract, 'split-sheet', workData.autor);

    // 3. Update Registry with Legal Pack
    OMNI.updateState(id, { 
        state: "active",
        legal: {
            bmi: bmiPack,
            contracts: {
                exclusive: exclusiveContract,
                splitSheet: splitSheet
            },
            iswcCandidate: `T-${Math.floor(Math.random() * 1000000000)}`,
            copyrightDecl: `Copyright © ${new Date().getFullYear()} ${workData.autor}. All Rights Reserved.`
        }
    });

    OMNI.emit("audio.ingested", id);
    OMNI.emit("legal.pack_generated", { id, bmi: true, contracts: 2 });
    
    return id;

  } catch(e) {
    console.warn("Archivo corrupto detectado", e);
    OMNI.emit("audio.rejected", file.name);
    throw e;
  }
}
