export interface AudioIdentity {
  id: string;
  sha256: string;
  timestamp: string;
}

export const AudioIdentityService = {
  async generateIdentity(file: File | Blob): Promise<AudioIdentity> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256 = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    
    const id = "ARKHE-" + Date.now();
    const timestamp = new Date().toISOString();

    return {
      id,
      sha256,
      timestamp
    };
  },

  downloadIdentity(identity: AudioIdentity) {
    const blob = new Blob([JSON.stringify(identity, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Identidad_${identity.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
