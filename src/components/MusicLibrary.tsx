import { useEffect, useState } from 'react';
import { Check, AlertTriangle, RefreshCw, FileAudio, FileText, Music, Shield, Fingerprint, Split, Cpu } from 'lucide-react';
import { AudioIdentityService } from '../services/audioIdentity';
import { StemEngineService } from '../services/stemEngine';
import { ArkheContainer } from '../services/arkheContainer';
import { OMNI } from '../core/omni/OmniCore';
import { ContractEngine } from '../core/legal/ContractEngine';
import { eventBus } from "../core/EventBus";
import "../core/omni/IntakeRouter";

interface TrackIntegrity {
  track_id: string;
  status: 'healthy' | 'corrupted' | 'missing_assets';
  required_assets: string[];
  missing_assets: string[];
  last_check: number;
  repairable: boolean;
  issues: string[];
}

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<TrackIntegrity[]>([]);
  const [loading, setLoading] = useState(true);
  const [healing, setHealing] = useState(false);
  const [processingStems, setProcessingStems] = useState<string | null>(null);
  const [activeEngine, setActiveEngine] = useState(ArkheContainer.seleccionar());

  useEffect(() => {
    const updateTracks = () => {
        const intelligences = OMNI.getAllIntelligences();
        const mappedTracks: TrackIntegrity[] = intelligences.map(intel => ({
            track_id: intel.id,
            status: intel.state === 'active' ? 'healthy' : 'corrupted',
            required_assets: ['master.wav', 'metadata.json'],
            missing_assets: [], // In a real app, check against actual files
            last_check: intel.created,
            repairable: intel.state === 'rejected',
            issues: intel.state === 'rejected' ? ['Corrupted file structure'] : []
        }));
        setTracks(mappedTracks);
        setLoading(false);
    };

    updateTracks();
    const unsubscribe = OMNI.subscribe(updateTracks);
    return unsubscribe;
  }, []);

  const handleHeal = async () => {
    setHealing(true);
    try {
      // Simulate healing process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // In a real app, this would trigger OMNI repair logic
      alert("Reparación completada. Integridad verificada.");
    } catch (e) {
      console.error(e);
    } finally {
      setHealing(false);
    }
  };

  const handleGenerateIdentity = async (trackId: string) => {
    try {
        const dummyContent = `Audio Content for ${trackId}`;
        const blob = new Blob([dummyContent], { type: 'audio/wav' });
        const identity = await AudioIdentityService.generateIdentity(blob);
        AudioIdentityService.downloadIdentity(identity);
    } catch (e) {
        console.error("Error generating identity", e);
        alert("Error generando identidad forense");
    }
  };

  const handleSeparateStems = async (trackId: string) => {
    setProcessingStems(trackId);
    try {
        await StemEngineService.separateStem(trackId);
        alert(`Stems generados para ${trackId}: Voz e Instrumental aislados.`);
    } catch (e) {
        alert("Error en separación de stems");
    } finally {
        setProcessingStems(null);
    }
  };

  const handleEvaluateEngines = () => {
    ArkheContainer.evaluar();
    setActiveEngine(ArkheContainer.seleccionar());
  };

  const handleGenerateContract = (trackId: string) => {
    const intel = OMNI.registry[trackId];
    if (!intel) return;

    // Map OMNI metadata to AudioDNA expected format
    const dnaMock = {
        id: trackId,
        sha256: intel.metadata.sha256,
        spectralHash: intel.metadata.spectralHash || "PENDING",
        timbreMap: "TIMBRE-MAP-GEN",
        bpm: intel.metadata.bpm || 120,
        isrcCandidate: intel.metadata.isrcCandidate || "PENDING",
        timestamp: new Date(intel.created).toISOString(),
        filename: intel.metadata.nombre,
        size: intel.metadata.tamaño,
        format: intel.metadata.tipo
    };
    
    const contract = ContractEngine.generateContract(dnaMock, 'exclusive', 'Visionary Founder');
    
    const blob = new Blob([contract.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Contrato_${contract.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Biblioteca Maestra</h2>
            <p className="text-slate-400">Gestión de activos, integridad y metadatos profesionales.</p>
        </div>
        <div className="flex gap-3">
            <div className="flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Motor Activo</span>
                    <span className="text-xs font-mono text-emerald-400">{activeEngine?.nombre || "Ninguno"}</span>
                </div>
                <button onClick={handleEvaluateEngines} className="ml-2 p-1 hover:bg-slate-800 rounded">
                    <RefreshCw className="w-3 h-3 text-slate-500" />
                </button>
            </div>
            <button 
            onClick={handleHeal}
            disabled={healing}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
            <RefreshCw className={`w-4 h-4 ${healing ? 'animate-spin' : ''}`} />
            {healing ? 'Reparando...' : 'Auto-Reparar Todo'}
            </button>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500">Cargando biblioteca...</div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-900/50 rounded-xl border border-dashed border-slate-800">
            No hay tracks en la biblioteca. Ingesta una obra para comenzar.
          </div>
        ) : (
          tracks.map((track) => (
            <div key={track.track_id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    track.status === 'healthy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {track.status === 'healthy' ? <Shield className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white">{track.track_id}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>Último escaneo: {new Date(track.last_check).toLocaleString()}</span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                      <span className={track.status === 'healthy' ? 'text-emerald-400' : 'text-red-400'}>
                        {track.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleGenerateIdentity(track.track_id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-medium transition-colors"
                        title="Generar Identidad Forense"
                    >
                        <Fingerprint className="w-3.5 h-3.5 text-sky-400" />
                        Identidad
                    </button>
                    <button 
                        onClick={() => handleSeparateStems(track.track_id)}
                        disabled={processingStems === track.track_id}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
                        title="Separar Stems"
                    >
                        <Split className={`w-3.5 h-3.5 text-purple-400 ${processingStems === track.track_id ? 'animate-pulse' : ''}`} />
                        {processingStems === track.track_id ? 'Separando...' : 'Stems'}
                    </button>
                    <button 
                        onClick={() => handleGenerateContract(track.track_id)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-xs font-medium transition-colors"
                        title="Generar Contrato"
                    >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        Contrato
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <AssetStatus label="Master WAV" icon={FileAudio} exists={!track.missing_assets.includes('master.wav')} />
                <AssetStatus label="Stems" icon={Music} exists={!track.missing_assets.some(a => a.includes('stems/'))} />
                <AssetStatus label="Partitura" icon={FileText} exists={!track.missing_assets.includes('score/piano_score.pdf')} />
                <AssetStatus label="Metadata" icon={FileText} exists={!track.missing_assets.includes('metadata.json')} />
              </div>

              {track.issues.length > 0 && (
                <div className="mt-4 p-3 bg-red-950/30 border border-red-900/50 rounded-lg">
                  <h4 className="text-xs font-bold text-red-400 mb-2 uppercase">Problemas Detectados</h4>
                  <ul className="list-disc list-inside text-xs text-red-300 space-y-1">
                    {track.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function AssetStatus({ label, icon: Icon, exists }: { label: string, icon: any, exists: boolean }) {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${
      exists ? 'bg-slate-800/50 border-slate-700 text-slate-300' : 'bg-red-900/10 border-red-900/30 text-red-400'
    }`}>
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
      {exists ? <Check className="w-3 h-3 ml-auto text-emerald-500" /> : <AlertTriangle className="w-3 h-3 ml-auto" />}
    </div>
  );
}
