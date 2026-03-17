import React, { useState, useEffect } from 'react';
import { ShoppingCart, Music, FileText, Mic, Shield, Download, DollarSign, CheckCircle2 } from 'lucide-react';
import { OMNI } from '../core/omni/OmniCore';

export default function MarketplaceView() {
  const [works, setWorks] = useState<any[]>([]);

  useEffect(() => {
    const updateWorks = () => {
      // Only show active/registered works in the marketplace
      const allWorks = OMNI.getAllIntelligences().filter((w: any) => w.state === 'active');
      setWorks(allWorks);
    };
    updateWorks();
    const unsubscribe = OMNI.subscribe(updateWorks);
    return () => unsubscribe();
  }, []);

  const handleBuy = (workId: string, type: string) => {
    alert(`Iniciando contrato inteligente para: ${type} (Obra ID: ${workId}).\n\nSe generará el split sheet y se transferirán los derechos correspondientes.`);
  };

  return (
    <div className="p-8 text-white font-sans h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-fuchsia-400 tracking-wider mb-2" style={{ textShadow: '0 0 10px rgba(232, 121, 249, 0.5)' }}>
            IP MARKETPLACE
          </h1>
          <p className="text-gray-400 text-sm">Monetización de Activos de Propiedad Intelectual Registrables</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-black/50 border border-cyan-500/30 px-4 py-2 rounded-lg flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-mono">0.00 USD</span>
          </div>
        </div>
      </div>

      {works.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-gray-700 rounded-xl bg-black/20">
          <ShoppingCart className="w-12 h-12 text-gray-600 mb-4" />
          <p className="text-gray-400">No hay obras registradas disponibles para monetizar.</p>
          <p className="text-gray-500 text-sm mt-2">Registra una obra en INGESTION para que aparezca aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {works.map((work) => (
            <div key={work.id} className="bg-black/40 border border-fuchsia-500/20 rounded-xl p-6 hover:border-fuchsia-500/50 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{work.metadata?.title || 'Obra Sin Título'}</h3>
                  <p className="text-sm text-cyan-400 font-mono">{work.id.split('-')[0]}</p>
                </div>
                <div className="bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full text-xs border border-cyan-500/30 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Blindado
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                  <span className="text-gray-500 text-xs block mb-1">Autoría</span>
                  <span className="text-gray-300 text-sm">{work.metadata?.author || 'ARKHÉ User'}</span>
                </div>
                <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
                  <span className="text-gray-500 text-xs block mb-1">Intervención IA</span>
                  <span className="text-gray-300 text-sm">{work.legal?.aiDisclosure?.percentage || 0}%</span>
                </div>
              </div>

              <h4 className="text-sm font-semibold text-gray-400 mb-3 border-b border-gray-800 pb-2">Opciones de Licenciamiento</h4>
              
              <div className="space-y-3">
                {/* Venta de Letra */}
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Venta de Letra (50% Autoría)</p>
                      <p className="text-xs text-gray-500">Regalías editoriales (INDAUTOR)</p>
                    </div>
                  </div>
                  <button onClick={() => handleBuy(work.id, 'Letra 50%')} className="px-4 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded text-sm font-medium transition-colors">
                    Ofertar
                  </button>
                </div>

                {/* Venta de Composición */}
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-fuchsia-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Music className="w-5 h-5 text-fuchsia-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Licencia de Composición (Beat/Melodía)</p>
                      <p className="text-xs text-gray-500">Regalías mecánicas</p>
                    </div>
                  </div>
                  <button onClick={() => handleBuy(work.id, 'Composición')} className="px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 rounded text-sm font-medium transition-colors">
                    Ofertar
                  </button>
                </div>

                {/* Licencia del Master */}
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-emerald-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Licencia del MASTER (Sync/Streaming)</p>
                      <p className="text-xs text-gray-500">Spotify, Netflix, Comerciales</p>
                    </div>
                  </div>
                  <button onClick={() => handleBuy(work.id, 'Master')} className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded text-sm font-medium transition-colors">
                    Ofertar
                  </button>
                </div>
              </div>

              {/* Separador de Stems (Upsell) */}
              <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-gray-500" />
                  Stems separados disponibles
                </div>
                <button onClick={() => alert('Descargando Stems (Voz, Instrumental, Bajo, Batería)...')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                  <Download className="w-3 h-3" />
                  Descargar Stems
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
