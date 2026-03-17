export const StorageService = {
  saveRegistry(registry: any, emit: (event: string, payload: any) => void) {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        "arkhe_registry",
        JSON.stringify(registry)
      );
      emit("registry.saved", true);
      console.log("[OMNI] Registry saved to local storage");
    } catch (e) {
      console.error("[OMNI] Failed to save registry", e);
      emit("registry.save_error", e);
    }
  },

  loadRegistry() {
    if (typeof window === 'undefined') return {};
    
    try {
      const saved = localStorage.getItem("arkhe_registry");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("[OMNI] Failed to load registry", e);
      return {};
    }
  }
};
