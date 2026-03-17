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

export interface AssetPack {
  lyrics: string;
  midiUrl?: string;
  wavUrl?: string;
  pdfUrl?: string;
  jsonUrl?: string;
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

export type ViewType = 'dashboard' | 'catalog' | 'ingestion' | 'legal' | 'library' | 'marketplace';
