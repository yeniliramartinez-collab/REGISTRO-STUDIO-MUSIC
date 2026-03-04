import { StorageService } from './Storage';
import { eventBus } from '../EventBus';

export interface Intelligence {
  id: string;
  type: string;
  metadata: any;
  legal?: any;
  certificate?: string;
  aiDeclaration?: string;
  distributionJson?: string;
  contract?: string;
  state: 'sandbox' | 'active' | 'rejected';
  score: number;
  created: number;
}

export interface OmniEvent {
  event: string;
  payload: any;
  time: number;
}

class OmniCore {
  registry: Record<string, Intelligence> = {};
  ingestQueue: any[] = [];
  events: OmniEvent[] = [];
  listeners: ((registry: Record<string, Intelligence>) => void)[] = [];

  constructor() {
      // Load from storage on init
      this.registry = StorageService.loadRegistry();
  }

  registerIntelligence(entity: { type: string; metadata: any; legal?: any }) {
    const id = crypto.randomUUID();
    
    this.registry[id] = {
      id,
      ...entity,
      state: "sandbox",
      score: 0,
      created: Date.now()
    };
    
    this.emit("intelligence.submitted", id);
    this.notifyListeners();
    return id;
  }

  emit(event: string, payload: any) {
    this.events.push({
      event,
      payload,
      time: Date.now()
    });
    console.log(`[OMNI] ${event}`, payload);
    // Forward to global EventBus
    eventBus.emit(event, payload);
  }

  updateState(id: string, updates: Partial<Intelligence>) {
      if (this.registry[id]) {
          this.registry[id] = { ...this.registry[id], ...updates };
          this.notifyListeners();
      }
  }

  subscribe(listener: (registry: Record<string, Intelligence>) => void) {
      this.listeners.push(listener);
      return () => {
          this.listeners = this.listeners.filter(l => l !== listener);
      };
  }

  notifyListeners() {
      this.listeners.forEach(l => l(this.registry));
      StorageService.saveRegistry();
  }
  
  getRegistryCount() {
      return Object.keys(this.registry).length;
  }
  
  getAllIntelligences() {
      return Object.values(this.registry).sort((a, b) => b.created - a.created);
  }
}

export const OMNI = new OmniCore();
// Expose to window for debugging/user request
if (typeof window !== 'undefined') {
    (window as any).OMNI = OMNI;
}
