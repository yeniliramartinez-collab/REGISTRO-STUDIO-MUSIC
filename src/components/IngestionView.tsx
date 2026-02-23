import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Plus, Package, Check, Music, FileAudio, AlertTriangle, ShieldCheck, Database, Activity } from 'lucide-react';
import { Song } from '../types';
import { intakeAudio, registry as intakeRegistry } from '../ingest/intakeRouter';
import { OMNI } from '../core/omni/OmniCore';

import { eventBus } from "../core/EventBus";
import "../core/IntakeRouter"; // Load the new Intake Router
import "../core/batch/LoteColectivo"; // Initialize Batch Listener
import "../core/batch/BatchCompiler"; // Initialize Compiler Listener
import { repairIfNeeded } from "../audio/autoRepair";

import { NeuralFeed } from './NeuralFeed';
import { FileDown, Zap } from 'lucide-react';

interface IngestionViewProps {
  onIngest: (newSongs: Song[]) => void;
}

export default function IngestionView({ onIngest }: IngestionViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastEntity, setLastEntity] = useState<any>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [registryCount, setRegistryCount] = useState(0);
  const [batchProgress, setBatchProgress] = useState("0 / 50");

  // Poll registry for updates (simple reactivity for demo)
  useEffect(() => {
      const interval = setInterval(() => {
          setRegistryCount(intakeRegistry.getAll().length);
      }, 1000);
      
      // Listen for processed tracks to update UI
      const handleIntelligenceReady = (entity: any) => {
          setIsProcessing(false);
          setLastEntity(entity);
      };

      eventBus.on("intelligence.ready", handleIntelligenceReady);

      // Listen for batch progress
      const handleBatchProgress = ({ actual, objetivo }: any) => {
          setBatchProgress(`${actual} / ${objetivo}`);
      };
      eventBus.on("batch.progress", handleBatchProgress);

      return () => {
          clearInterval(interval);
          eventBus.off("intelligence.ready", handleIntelligenceReady);
          eventBus.off("batch.progress", handleBatchProgress);
      };
  }, []);

  const handleIntake = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Auto-Repair / Validation Check
    const repairResult = await repairIfNeeded(file);
    if (!repairResult.repaired || !repairResult.file) {
        alert("Archivo corrupto o inválido detectado por AutoRepair.");
        return;
    }
    const safeFile = repairResult.file;

    setIsProcessing(true);
    setLastEntity(null);

    try {
        // Trigger New Event-Based Ingestion Workflow
        await eventBus.emit("track.ingested", { file: safeFile });
        
    } catch (e) {
        alert("Error en intake: " + (e as Error).message);
        setIsProcessing(false);
    } finally {
        if (audioInputRef.current) audioInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-black tracking-tight text-white">
            {registryCount > 0 
                ? `Sistema Activo - ${registryCount} Inteligencias`
                : "Ingesta Masiva OMNI"}
        </h3>
        <p className="text-slate-400">Motor de análisis forense, scoring y generación legal automática.</p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full border border-slate-700">
            <Package className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono text-slate-300">LOTE COLECTIVO: <span className="text-white font-bold">{batchProgress}</span></span>
            <button 
                onClick={() => eventBus.emit("batch.force")}
                className="ml-2 p-1 hover:bg-indigo-500/20 rounded-full text-indigo-400 transition-colors"
                title="Forzar Compilación de Expediente"
            >
                <FileDown className="w-3 h-3" />
            </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <NeuralFeed />
      </div>

      {/* OMNI Ingest */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse opacity-75" />
            <Activity className="w-10 h-10 text-indigo-500 relative z-10" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-2xl font-bold text-white">Intake Router</h4>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Aísla, valida, genera SHA-256, construye BMI Pack y puntúa la entidad.
            </p>
          </div>

          <div className="flex gap-4">
             <input 
              type="file" 
              id="audioInput" 
              accept=".wav,.mp3,.aiff,.ogg" 
              ref={audioInputRef}
              className="hidden"
              onChange={handleIntake}
            />
            <button 
              onClick={() => audioInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-3"
            >
              {isProcessing ? (
                  <>Procesando...</>
              ) : (
                  <>
                    <FileAudio className="w-5 h-5" />
                    Ingesta Masiva
                  </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Last Entity Result */}
      {lastEntity && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl ${lastEntity.safe ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                    {lastEntity.safe ? <ShieldCheck className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
                </div>
                <div>
                    <h4 className="text-xl font-bold text-white">
                        {lastEntity.safe ? 'Entidad Registrada' : 'Entidad Rechazada'}
                    </h4>
                    <p className="text-slate-400 text-sm">ID: {lastEntity.id?.substring(0, 16)}...</p>
                </div>
            </div>
            
            {lastEntity.safe && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Score</label>
                        <p className="font-mono text-emerald-400 text-2xl font-bold">{lastEntity.score}/100</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Estado</label>
                        <p className="font-mono text-white text-sm uppercase flex items-center gap-2">
                            {lastEntity.state}
                            {lastEntity.mastered && <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] rounded border border-indigo-500/30">MASTERED</span>}
                        </p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">SHA-256</label>
                        <p className="font-mono text-slate-400 text-xs break-all">{lastEntity.hash}</p>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Spectral Hash</label>
                        <p className="font-mono text-indigo-400 text-xs break-all">{lastEntity.spectralHash || "N/A"}</p>
                    </div>
                    
                    {lastEntity.contract && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 col-span-full flex justify-between items-center">
                             <div>
                                <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Contrato Legal</label>
                                <p className="text-xs text-indigo-300 font-mono">Generado automáticamente y vinculado al hash.</p>
                             </div>
                             <button 
                                onClick={() => {
                                    const blob = new Blob([lastEntity.contract], { type: "text/plain" });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = `Contrato_${lastEntity.hash.substring(0,8)}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                             >
                                Descargar Contrato
                             </button>
                        </div>
                    )}

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/50 col-span-full">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">BMI Legal Pack</label>
                        <pre className="font-mono text-indigo-300 text-xs mt-2 overflow-auto">
                            {JSON.stringify(lastEntity.legal, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
            
            {!lastEntity.safe && (
                <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/30">
                    <p className="text-red-400 text-sm font-bold">Error: {lastEntity.error}</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
