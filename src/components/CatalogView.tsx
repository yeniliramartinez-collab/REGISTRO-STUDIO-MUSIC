import { Music2, Trash2, Music, ShieldCheck, FileText, Activity, Lock } from 'lucide-react';
import { Song } from '../types';
import { OMNI } from "../core/omni/OmniCore";
import { eventBus } from "../core/EventBus";
import { useEffect, useState } from "react";

interface CatalogViewProps {
  songs: Song[];
  onDelete: (id: number) => void;
}

export default function CatalogView({ songs, onDelete }: CatalogViewProps) {
  const [works, setWorks] = useState<any[]>([]);
  const [stats, setStats] = useState({ active: 0, total: 0 });

  const refreshWorks = () => {
    const allWorks = OMNI.getAllIntelligences();
    setWorks(allWorks);
    setStats({
        active: allWorks.filter((w: any) => w.state === 'active').length,
        total: allWorks.length
    });
  };

  useEffect(() => {
    // Initial load
    refreshWorks();

    // Listen for updates
    const handleUpdate = () => refreshWorks();
    
    // Subscribe to both event bus and OMNI internal listener
    eventBus.on("track.processed", handleUpdate);
    eventBus.on("intelligence.ready", handleUpdate);
    const unsubscribe = OMNI.subscribe(() => refreshWorks());

    return () => {
        eventBus.off("track.processed", handleUpdate);
        eventBus.off("intelligence.ready", handleUpdate);
        unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-l-4 border-emerald-500 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Obras Activas (BMI Ready)</p>
            <p className="text-3xl font-black text-white">{stats.active}</p>
          </div>
          <Activity className="absolute right-4 top-4 text-emerald-500/10 w-24 h-24" />
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-blue-500 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Lote Colectivo</p>
            <p className="text-3xl font-black text-blue-400">{Math.min(100, (stats.active / 50) * 100).toFixed(0)}%</p>
            <p className="text-xs text-blue-500/50 mt-1">{stats.active} / 50 para cierre</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500/20 w-full">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(stats.active / 50) * 100}%` }} />
          </div>
        </div>
        <div className="glass p-6 rounded-2xl border-l-4 border-amber-500 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Blindaje Legal</p>
            <p className="text-3xl font-black text-amber-400">OMNI KERNEL</p>
            <p className="text-xs text-amber-500/50 mt-1">Contratos + Hashes + Timbre</p>
          </div>
          <ShieldCheck className="absolute right-4 top-4 text-amber-500/10 w-24 h-24" />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                Registro Inmutable (Kernel)
            </h3>
            <span className="text-xs font-mono text-slate-500">{works.length} ENTIDADES</span>
        </div>
        
        {works.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Music className="w-12 h-12 text-slate-700" />
              <p className="text-slate-500 italic">El núcleo está vacío. Inicia la ingesta masiva.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {works.map((w) => (
              <div key={w.id} className="p-4 hover:bg-slate-800/30 transition-colors group flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${w.state === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-800 text-slate-500'}`}>
                        <Music2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">{w.metadata?.nombre || w.metadata?.title || "Sin Título"}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                            <span>{w.metadata?.autor || w.metadata?.author || "Desconocido"}</span>
                            <span>•</span>
                            <span className="text-indigo-400">SHA: {w.hash?.substring(0, 8)}...</span>
                            {w.spectralHash && (
                                <>
                                    <span>•</span>
                                    <span className="text-purple-400">SPEC: {w.spectralHash?.substring(0, 8)}...</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {w.contract && (
                        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                            <FileText className="w-3 h-3" />
                            <span>Contrato</span>
                        </div>
                    )}
                    <div className="text-right">
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Score</p>
                        <p className="font-mono text-white font-bold">{w.score || 0}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
