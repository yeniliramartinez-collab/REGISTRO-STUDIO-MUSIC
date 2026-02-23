import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TrackIntegrity } from './types';
import { TrackPackageGenerator } from './trackPackageGenerator';
import { IntegrityScanner } from './integrityScanner';

const LIBRARY_PATH = path.join(process.cwd(), 'library');

export const SelfHealingEngine = {
  healAll() {
    const reports = IntegrityScanner.scanAll();
    const healed = [];
    
    for (const report of reports) {
      if (report.status !== 'healthy') {
        console.log(`Healing track: ${report.track_id}...`);
        this.healTrack(report);
        healed.push(report.track_id);
      }
    }
    return healed;
  },

  healTrack(report: TrackIntegrity) {
    const trackPath = path.join(LIBRARY_PATH, report.track_id);
    const metadataPath = path.join(trackPath, 'metadata.json');
    
    let metadata: any = { title: 'Unknown', author: 'Unknown' };
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      } catch (e) {
        console.error(`Cannot read metadata for ${report.track_id}`);
      }
    }

    // Repair Missing Assets
    report.missing_assets.forEach(asset => {
      const fullPath = path.join(trackPath, asset);
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      console.log(`Restoring ${asset}...`);

      if (asset.includes('score/')) {
        TrackPackageGenerator.generateScore(metadata.title, metadata.author, fullPath);
      } else if (asset.includes('midi/')) {
        TrackPackageGenerator.generateMidi(fullPath);
      } else if (asset.includes('ads/') && asset.endsWith('.mp3')) {
        const masterPath = path.join(trackPath, 'obra.wav');
        TrackPackageGenerator.generatePreview(masterPath, fullPath);
      } else if (asset.includes('ads/') && asset.endsWith('.mp4')) {
        TrackPackageGenerator.generateVideoLoop(fullPath);
      } else if (asset.includes('media/portada')) {
        TrackPackageGenerator.generateCover(fullPath);
      } else if (asset === 'letra.txt') {
        fs.writeFileSync(fullPath, metadata.lyrics || "Instrumental");
      } else if (asset === 'sha256.txt') {
        const masterPath = path.join(trackPath, 'obra.wav');
        if (fs.existsSync(masterPath)) {
            const fileBuffer = fs.readFileSync(masterPath);
            const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');
            fs.writeFileSync(fullPath, sha256);
        }
      } else if (asset.includes('stems/')) {
         const masterPath = path.join(trackPath, 'obra.wav');
         TrackPackageGenerator.generateStems(masterPath, path.join(trackPath, 'stems'));
      } else if (asset === 'metadata.json') {
        // Regenerate basic metadata if completely missing
        const newMeta = {
            id: report.track_id,
            title: "Recovered Track",
            author: "System",
            createdAt: Date.now(),
            sha256: "RECALCULATE_REQUIRED",
            workId: crypto.randomUUID(),
            iswc: "UNKNOWN"
        };
        fs.writeFileSync(fullPath, JSON.stringify(newMeta, null, 2));
      }
    });

    // Re-scan to update status
    IntegrityScanner.scanTrack(report.track_id);
  }
};
