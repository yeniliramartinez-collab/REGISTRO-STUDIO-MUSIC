export interface Entity {
  id: string;
  [key: string]: any;
}

export class IntelligenceRegistry {
  entities: Map<string, Entity>;

  constructor() {
    this.entities = new Map();
  }

  register(entity: Entity) {
    this.entities.set(entity.id, entity);
    return entity;
  }

  update(id: string, updates: Partial<Entity>) {
    const entity = this.entities.get(id);
    if (!entity) return;
    Object.assign(entity, updates);
  }

  get(id: string) {
    return this.entities.get(id);
  }
  
  getAll() {
      return Array.from(this.entities.values());
  }
}
