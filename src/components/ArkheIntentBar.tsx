import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { eventBus } from '../core/EventBus';

export default function ArkheIntentBar() {
  const [intent, setIntent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;

    setIsProcessing(true);
    setStatus('Analizando intención...');

    // Simulate "God-Level" orchestration
    await new Promise(r => setTimeout(r, 1500));
    setStatus('Ingestando y Masterizando...');
    
    await new Promise(r => setTimeout(r, 2000));
    setStatus('Generando Contratos y Splits Predictivos...');
    
    await new Promise(r => setTimeout(r, 1500));
    setStatus('Buscando Oportunidades de Sincronización...');
    
    await new Promise(r => setTimeout(r, 2000));
    setStatus('¡Catálogo Optimizado y Monetizando!');
    
    setTimeout(() => {
      setIsProcessing(false);
      setStatus(null);
      setIntent('');
      // Emit a global event that the UI could listen to refresh
      eventBus.emit('arkhe.intent.completed', { intent });
    }, 3000);
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl shadow-2xl shadow-indigo-500/10 overflow-hidden transition-all duration-500">
        {status && (
          <div className="bg-indigo-600/20 px-6 py-2 border-b border-indigo-500/20 flex items-center gap-3">
            {isProcessing ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-sm font-medium text-indigo-200">{status}</span>
          </div>
        )}
        <form onSubmit={handleIntent} className="flex items-center p-2">
          <div className="pl-4 pr-2">
            <Sparkles className={`w-5 h-5 ${isProcessing ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`} />
          </div>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            disabled={isProcessing}
            placeholder="Ej: 'Hazme ganar dinero con mi último track' o 'Protege y distribuye mi álbum'"
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 px-2 py-3 text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!intent.trim() || isProcessing}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white p-3 rounded-xl transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
