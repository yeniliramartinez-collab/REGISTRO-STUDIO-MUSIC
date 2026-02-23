import { masterAudio } from './masterEngine';

export interface RepairResult {
  repaired: boolean;
  file?: File;
  error?: string;
}

export async function repairIfNeeded(file: File): Promise<RepairResult> {
  try {
    // Attempt to master/repair the audio
    // This process implicitly repairs headers by decoding and re-encoding
    const repairedFile = await masterAudio(file);

    return {
      repaired: true,
      file: repairedFile
    };

  } catch (e: any) {
    console.error("AutoRepair failed:", e);
    return {
      repaired: false,
      error: e.message || "Unknown error during audio repair"
    };
  }
}
