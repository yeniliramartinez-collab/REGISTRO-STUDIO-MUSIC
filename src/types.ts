export interface Song {
  id: number;
  title: string;
  lyrics: string;
  hash: string;
  date: string;
}

export interface LegalData {
  author: string;
  album: string;
  declaration: string;
}

export type ViewType = 'catalog' | 'ingestion' | 'legal' | 'library';
