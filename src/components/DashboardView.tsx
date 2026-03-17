import { Shield, Database, UploadCloud, Music, FileText, ShoppingCart, AlertCircle, CheckCircle2, Terminal, Cpu, Zap, Crosshair, Fingerprint, Activity } from 'lucide-react';
import { Song, ViewType } from '../types';
import { OMNI } from '../core/omni/OmniCore';
import { useEffect, useState } from 'react';

interface DashboardViewProps {
  onNavigate: (view: ViewType) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const [stats, setStats] = useState({ active: 0, pending: 0, total: 0 });

  useEffect(() => {
    const refreshStats = () => {
      const allWorks = OMNI.getAllIntelligences();
      setStats({
        active: allWorks.filter((w: any) => w.state === 'active').length,
        pending: allWorks.filter((w: any) => w.state === 'pending').length,
        total: allWorks.length
      });
    };

    refreshStats();
    const unsubscribe = OMNI.subscribe(refreshStats);
    return () => unsubscribe();
  }, []);

  const status = stats.total === 0 
    ? { text: "SYS.ERR: MISSING_DATA // AWAITING_INPUT", color: "text-red-500", border: "border-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.6)]", icon: AlertCircle }
    : { text: "SYS.OK: KERNEL_ACTIVE // SHIELDS_UP", color: "text-cyan-400", border: "border-cyan-400", glow: "shadow-[0_0_15px_rgba(34,211,238,0.6)]", icon: CheckCircle2 };

  const cards = [
    { id: 'library', title: 'VAULT_CORE', desc: 'Almacenamiento soberano encriptado. Stems y hashes.', icon: Database, view: 'library' as ViewType, color: 'cyan' },
    { id: 'pending', title: 'QUEUE_SYNC', desc: `${stats.pending}/50 en buffer. Lote listo para INDAUTOR.`, icon: Activity, view: 'ingestion' as ViewType, color: 'fuchsia' },
    { id: 'repair', title: 'AUTO_REPAIR', desc: 'Motor dual offline. Masterización y corrección.', icon: Cpu, view: 'ingestion' as ViewType, color: 'cyan' },
    { id: 'registered', title: 'SECURE_ASSETS', desc: `${stats.active} entidades blindadas. Listas para monetizar.`, icon: Shield, view: 'catalog' as ViewType, color: 'fuchsia' },
    { id: 'legal', title: 'LEGAL_PACK', desc: 'Generación automática de PDF + HTML + ISRC.', icon: Fingerprint, view: 'legal' as ViewType, color: 'cyan' },
    { id: 'marketplace', title: 'IP_MARKET', desc: 'Contratos inteligentes. Porcentajes soberanos.', icon: Crosshair, view: 'marketplace' as ViewType, color: 'fuchsia' },
  ];

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-[#050505] text-white p-8 font-sans">
      {/* Custom Styles for Neon/Gamer Aesthetic */}
      <style>{`
        .neon-text-cyan { text-shadow: 0 0 10px rgba(34, 211, 238, 0.8), 0 0 20px rgba(34, 211, 238, 0.4); }
        .neon-text-fuchsia { text-shadow: 0 0 10px rgba(232, 121, 249, 0.8), 0 0 20px rgba(232, 121, 249, 0.4); }
        .neon-border-cyan { box-shadow: 0 0 10px rgba(34, 211, 238, 0.5), inset 0 0 10px rgba(34, 211, 238, 0.2); }
        .neon-border-fuchsia { box-shadow: 0 0 15px rgba(232, 121, 249, 0.6), inset 0 0 10px rgba(232, 121, 249, 0.2); }
        .scanlines { 
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.25)); 
          background-size: 100% 4px; 
          pointer-events: none;
        }
        .grid-bg { 
          background-image: 
            linear-gradient(to right, rgba(34, 211, 238, 0.07) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(34, 211, 238, 0.07) 1px, transparent 1px); 
          background-size: 50px 50px; 
        }
        .clip-edges { clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .clip-button { clip-path: polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px); }
      `}</style>

      {/* Background Effects */}
      <div className="absolute inset-0 grid-bg z-0"></div>
      <div className="absolute inset-0 scanlines z-10"></div>
      
      {/* Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="relative z-20 max-w-7xl mx-auto space-y-12 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mt-8">
          <div className="inline-block relative">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic transform -skew-x-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 neon-text-cyan">
                ARKHÉ
              </span>
              <br />
              <span className="text-4xl md:text-6xl text-white tracking-[0.2em] neon-text-fuchsia">
                SOVEREIGN_FACTORY
              </span>
            </h1>
          </div>
          <p className="text-cyan-400/80 font-mono text-sm md:text-base tracking-[0.3em] uppercase">
            [ Sistema Híbrido • 100% Offline • Blindaje Nivel Dios ]
          </p>
        </div>

        {/* Status Terminal */}
        <div className="flex justify-center">
          <div className={`clip-edges flex items-center gap-4 px-8 py-4 bg-black/80 border-l-4 ${status.border} ${status.glow} backdrop-blur-md`}>
            <status.icon className={`w-6 h-6 ${status.color} animate-pulse`} />
            <span className={`font-mono font-bold tracking-widest ${status.color}`}>
              {status.text}
              <span className="animate-ping inline-block ml-2 w-2 h-4 bg-current align-middle"></span>
            </span>
          </div>
        </div>

        {/* Cyber Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => onNavigate(card.view)}
              className={`group relative text-left p-6 bg-black/60 backdrop-blur-sm border border-slate-800 hover:border-${card.color}-400 transition-all duration-300 clip-edges overflow-hidden`}
            >
              {/* Hover Background Glow */}
              <div className={`absolute inset-0 bg-${card.color}-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Corner Accents */}
              <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-${card.color}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-${card.color}-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

              <div className="relative z-10 flex flex-col gap-4">
                <div className={`w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-700 group-hover:border-${card.color}-400 group-hover:neon-border-${card.color} transition-all duration-300 transform group-hover:-translate-y-1`}>
                  <card.icon className={`w-6 h-6 text-slate-400 group-hover:text-${card.color}-400 transition-colors`} />
                </div>
                <div>
                  <h2 className={`text-xl font-black font-mono tracking-wider text-white mb-2 group-hover:neon-text-${card.color} transition-all`}>
                    {card.title}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed uppercase tracking-wide">
                    {card.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Massive Neon CTA */}
        <div className="flex justify-center pt-12 pb-20">
          <button 
            onClick={() => onNavigate('ingestion')}
            className="clip-button relative group px-12 py-6 bg-black border-2 border-fuchsia-500 text-fuchsia-400 font-black text-xl tracking-[0.2em] uppercase overflow-hidden transition-all duration-500 hover:bg-fuchsia-500 hover:text-black hover:neon-border-fuchsia"
          >
            {/* Scanline effect on button */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJ0cmFuc3BhcmVudCI+PC9yZWN0Pgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDAsMCwwLDAuMikiPjwvcmVjdD4KPC9zdmc+')] opacity-50 group-hover:opacity-20 transition-opacity"></div>
            
            <span className="relative z-10 flex items-center gap-4">
              <Zap className="w-8 h-8 group-hover:animate-bounce" />
              INICIAR_INGESTA_SOBERANA
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
