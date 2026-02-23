type EventHandler = (payload: any) => Promise<void> | void;

class EventBus {
  private listeners: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }

  async emit(event: string, payload?: any) {
    const handlers = this.listeners[event] || [];
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (e) {
        console.error(`Falla en evento ${event}`, e);
        // Avoid infinite loop if system.failure listener fails
        if (event !== "system.failure") {
            this.emit("system.failure", { event, error: e });
        }
      }
    }
  }
  
  off(event: string, handler: EventHandler) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }
}

export const eventBus = new EventBus();
