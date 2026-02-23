export type LifecycleState =
  | "submitted"
  | "pending"
  | "sandbox"
  | "shadow"
  | "active"
  | "deprecated"
  | "rejected";

export interface IntelligenceEntity {
  id: string;
  type: "track";
  hash: string;
  score: number;
  lifecycle_state: LifecycleState;
  created_at: number;
  metadata?: any;
}

class IntelligenceRegistry {
  private store: Record<string, IntelligenceEntity> = {};

  // Adapted for Browser Environment (Async Web Crypto)
  async register(file: File): Promise<IntelligenceEntity> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const entity: IntelligenceEntity = {
      id: hash,
      type: "track",
      hash,
      score: 0,
      lifecycle_state: "submitted",
      created_at: Date.now(),
      metadata: {
          title: file.name,
          size: file.size,
          type: file.type
      }
    };

    this.store[hash] = entity;
    return entity;
  }

  updateState(id: string, state: LifecycleState) {
    if (this.store[id]) {
      this.store[id].lifecycle_state = state;
    }
  }

  score(id: string, delta: number) {
    if (this.store[id]) {
      this.store[id].score += delta;
    }
  }
  
  get(id: string) {
      return this.store[id];
  }
  
  getAll() {
      return Object.values(this.store);
  }
}

export const registry = new IntelligenceRegistry();
