import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TrackIntegrity } from './types';

const LIBRARY_PATH = path.join(process.cwd(), 'library');

export const IntegrityScanner = {
  scanAll(): TrackIntegrity[] {
    if (!fs.existsSync(LIBRARY_PATH)) return [];
    
    const trackDirs = fs.readdirSync(LIBRARY_PATH).filter(file => 
      fs.statSync(path.join(LIBRARY_PATH, file)).isDirectory() && file.startsWith('TRACK_')
    );

    return trackDirs.map(trackId => this.scanTrack(trackId));
  },

  scanTrack(trackId: string): TrackIntegrity {
    const trackPath = path.join(LIBRARY_PATH, trackId);
    const integrityPath = path.join(trackPath, 'integrity.json');
    const metadataPath = path.join(trackPath, 'metadata.json');

    // Default integrity if missing
    let integrity: TrackIntegrity = {
      track_id: trackId,
      status: 'healthy',
      required_assets: [
        'obra.wav',
        'metadata.json',
        'sha256.txt',
        'letra.txt',
        'score/partitura.pdf',
        'midi/guia.mid',
        'stems/voz.wav',
        'stems/instrumental.wav',
        'ads/preview_30s.mp3',
        'media/portada.png'
      ],
      missing_assets: [],
      last_check: Date.now(),
      repairable: true,
      issues: []
    };

    if (fs.existsSync(integrityPath)) {
      try {
        const storedIntegrity = JSON.parse(fs.readFileSync(integrityPath, 'utf-8'));
        // Merge with defaults to ensure we have all fields
        integrity = { ...integrity, ...storedIntegrity };
      } catch (e) {
        integrity.issues.push('integrity.json is corrupt');
      }
    } else {
      integrity.issues.push('integrity.json missing');
    }

    // Check Assets
    integrity.missing_assets = [];
    integrity.required_assets.forEach(asset => {
      if (!fs.existsSync(path.join(trackPath, asset))) {
        integrity.missing_assets.push(asset);
      }
    });

    // Check Metadata and Hash
    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        const masterPath = path.join(trackPath, 'obra.wav');
        
        if (fs.existsSync(masterPath)) {
          const fileBuffer = fs.readFileSync(masterPath);
          const currentHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
          
          if (metadata.sha256 && metadata.sha256 !== currentHash) {
            integrity.issues.push('Hash mismatch: Master WAV has been modified');
          }
          
          if (fileBuffer.byteLength < 1024) { // Arbitrary small size check
             integrity.issues.push('Suspicious file size: Master WAV is too small (<1KB)');
          }
        }
      } catch (e) {
        integrity.issues.push('metadata.json is corrupt');
      }
    } else {
      integrity.issues.push('metadata.json missing');
    }

    // Determine Status
    if (integrity.missing_assets.length > 0 || integrity.issues.length > 0) {
      integrity.status = 'corrupted';
    } else {
      integrity.status = 'healthy';
    }

    integrity.last_check = Date.now();
    
    // Save updated integrity report
    fs.writeFileSync(integrityPath, JSON.stringify(integrity, null, 2));

    return integrity;
  }
};
