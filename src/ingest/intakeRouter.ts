import { sandboxFile } from '../storage/fileSandbox';
import { generateAudioHash } from '../core/audioHash';
import { buildLegalPack, Metadata } from '../legal/legalPackBuilder';
import { evaluateTrack } from '../core/ScoringEngine';
import { IntelligenceRegistry } from '../registry/intelligenceRegistry';
import { repairIfNeeded } from '../audio/autoRepair';
import { generarContrato } from '../legal/contractEngine';

export const registry = new IntelligenceRegistry();

export async function intakeAudio(file: File, metadata: Metadata) {

  // 1. Auto-Repair / Mastering Layer
  const repair = await repairIfNeeded(file);

  if (!repair.repaired || !repair.file) {
    return {
      status: 'rejected',
      safe: false,
      error: repair.error || 'Archivo dañado irreparable'
    };
  }

  const cleanFile = repair.file;

  // 2. Sandbox Validation
  const sandbox = sandboxFile(cleanFile);
  if (!sandbox.safe) return { ...sandbox, id: 'rejected' };

  // 3. Generate Identity (SHA-256)
  const hash = await generateAudioHash(cleanFile);
  
  // 4. Build Legal Pack
  const legal = buildLegalPack(metadata);
  
  // 5. Generate Contract
  const contrato = generarContrato(metadata, hash);

  const entity = {
    id: hash,
    hash,
    metadata,
    legal,
    contract: contrato, // Store contract content
    safe: true,
    mastered: true,
    state: 'sandbox',
    score: 0
  };

  // 6. Scoring
  // evaluateTrack requires an ID and updates the registry directly. 
  // For this legacy router, we might just skip it or mock it if it doesn't use the new registry.
  // entity.score = scoreEntity(entity); 
  entity.state = 'active';

  // 7. Register
  registry.register(entity);

  return entity;
}
