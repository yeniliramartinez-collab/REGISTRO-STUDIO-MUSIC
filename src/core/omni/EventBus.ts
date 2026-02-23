type EventHandler = (payload: any) => Promise<void>;

class EventBus {
  private handlers: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  async emit(event: string, payload: any) {
    const handlers = this.handlers[event] || [];
    for (const handler of handlers) {
      await handler(payload);
    }
  }
}

export const eventBus = new EventBus();
