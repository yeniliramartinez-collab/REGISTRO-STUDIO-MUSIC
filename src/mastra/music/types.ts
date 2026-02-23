export interface TrackIntegrity {
  track_id: string;
  status: 'healthy' | 'corrupted' | 'missing_assets';
  required_assets: string[];
  missing_assets: string[];
  last_check: number;
  repairable: boolean;
  issues: string[];
}

export interface TrackMetadata {
  id: string;
  workId: string;
  iswc: string;
  title: string;
  author: string;
  performer: string;
  aiUsed: string;
  bpm: number;
  key: string;
  duration: number;
  sha256: string;
  createdAt: number;
  lyrics?: string;
}
