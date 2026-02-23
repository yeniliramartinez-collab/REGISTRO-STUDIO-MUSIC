import fs from 'fs';
import path from 'path';

export interface TrackMetadata {
  track_id: string;
  title: string;
  bpm: number;
  key: string;
  duration: number;
  sha256_master: string;
  stems_hash: Record<string, string>;
  price: number;
  license: string;
  available: boolean;
}

const REGISTRY_PATH = path.join(process.cwd(), 'music_registry.json');

export const MusicRegistry = {
  getAll(): TrackMetadata[] {
    if (!fs.existsSync(REGISTRY_PATH)) {
      return [];
    }
    const raw = fs.readFileSync(REGISTRY_PATH, 'utf-8');
    return JSON.parse(raw);
  },

  add(track: TrackMetadata) {
    const tracks = this.getAll();
    tracks.push(track);
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(tracks, null, 2));
  },

  get(trackId: string): TrackMetadata | undefined {
    return this.getAll().find(t => t.track_id === trackId);
  }
};
