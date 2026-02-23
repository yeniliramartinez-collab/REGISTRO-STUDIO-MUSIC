import { OMNI } from './OmniCore';

export const StorageService = {
  saveRegistry() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(
        "arkhe_registry",
        JSON.stringify(OMNI.registry)
      );
      OMNI.emit("registry.saved", true);
      console.log("[OMNI] Registry saved to local storage");
    } catch (e) {
      console.error("[OMNI] Failed to save registry", e);
      OMNI.emit("registry.save_error", e);
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
