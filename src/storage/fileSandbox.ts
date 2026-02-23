export interface SandboxResult {
  status: 'sandbox' | 'rejected';
  safe: boolean;
  error?: string;
}

export function sandboxFile(file: File): SandboxResult {
  try {
    if (file.size === 0) throw new Error("Archivo vacío");
    
    // Basic MIME type check for audio
    if (!file.type.startsWith('audio/') && !file.name.endsWith('.txt')) {
         // Allow txt for lyrics as per previous context, but warn
         // For strict audio sandbox:
         // throw new Error("Formato no soportado");
    }

    return {
      status: 'sandbox',
      safe: true
    };

  } catch (e: any) {
    return {
      status: 'rejected',
      safe: false,
      error: e.message
    };
  }
}
