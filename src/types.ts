export interface AuthorShare {
  name: string;
  role: 'author' | 'composer' | 'producer' | 'performer';
  percentage: number;
  identityId: string; // Verifiable ID
}

export interface AI_Disclosure {
  used: boolean;
  tools: string[];
  elements: ('lyrics' | 'melody' | 'arrangement' | 'voice' | 'mastering')[];
  percentage: number;
}

export interface LegalPack {
  certificateId: string;
  timestamp: number;
  sha256: string;
  aiDisclosure: AI_Disclosure;
  shares: AuthorShare[];
  isrc?: string;
  iswc?: string;
  indautorId?: string;
  impiId?: string;
}

export interface AssetPerformance {
  conversionScore: number;
  engagement: number;
  clicks: number;
  impressions: number;
  ctr: number; // Click-through rate
  daysActive: number;
  lastRedesignDate?: number;
  status: 'optimal' | 'needs_redesign' | 'redesigning';
}

export interface AssetPack {
  lyrics: string;
  midiUrl?: string;
  wavUrl?: string;
  pdfUrl?: string;
  jsonUrl?: string;
  performance?: AssetPerformance;
}

export interface Song {
  id: string;
  title: string;
  author: string;
  genre: string;
  duration: string;
  state: 'pending' | 'sandbox' | 'active' | 'rejected';
  created: number;
  legal: LegalPack;
  assets: AssetPack;
  score: number;
  spectralHash?: string;
  timbreMap?: number[];
  ipValidation?: {
    status: string;
    confidence: number;
    issues: string[];
  };
}

export interface LegalData {
  author: string;
  album: string;
  declaration: string;
}

export interface NarrativeAngle {
  date: string;
  angle: string;
  description: string;
  keywords: string[];
}

export type SocialPlatform = 'TikTok' | 'Instagram' | 'Pinterest' | 'YouTube';

export interface VaultAsset {
  id: string;
  songId: string;
  title: string;
  type: 'video' | 'image' | 'audio_snippet' | 'text';
  contentUrl: string;
  narrativeAngle: string; // The angle it was generated for
  priorityScore: number;
  status: 'vaulted' | 'scheduled' | 'published';
  scheduledFor?: {
    platform: SocialPlatform;
    time: number; // timestamp
  }[];
}

export type ViewType = 'catalog' | 'ingestion' | 'legal' | 'library' | 'marketplace' | 'vault';
