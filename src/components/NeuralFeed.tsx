import { useEffect, useState, useRef } from 'react';
import { eventBus } from '../core/EventBus';
import { Activity, Terminal } from 'lucide-react';

export function NeuralFeed() {
  const [logs, setLogs] = useState<string[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addLog = (msg: string) => {
      setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const handleSubmitted = (p: any) => addLog(`📥 INTAKE: ${p.file?.name || 'Audio File'}`);
    const handleValidated = (p: any) => addLog(`✅ VALIDATED: ${p.id.substring(0, 8)}...`);
    const handleProcessed = (p: any) => addLog(`🔐 HASHED: ${p.hash.substring(0, 8)}...`);
    const handleBatch = (p: any) => addLog(`📦 BATCH: ${p.actual}/${p.objetivo}`);
    const handleReady = () => addLog(`📜 PDF GENERATED`);
    const handleFailure = (p: any) => addLog(`⚠️ FAILURE: ${p.event}`);

    eventBus.on("track.ingested", handleSubmitted);
    eventBus.on("track.validated", handleValidated);
    eventBus.on("track.processed", handleProcessed);
    eventBus.on("batch.progress", handleBatch);
    eventBus.on("batch.ready", handleReady);
    eventBus.on("system.failure", handleFailure);

    return () => {
      eventBus.off("track.ingested", handleSubmitted);
      eventBus.off("track.validated", handleValidated);
      eventBus.off("track.processed", handleProcessed);
      eventBus.off("batch.progress", handleBatch);
      eventBus.off("batch.ready", handleReady);
      eventBus.off("system.failure", handleFailure);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (logs.length === 0) return null;

  return (
    <div className="bg-black/80 border border-indigo-500/30 rounded-xl p-4 font-mono text-xs text-indigo-400 h-32 overflow-y-auto shadow-[0_0_15px_rgba(99,102,241,0.1)]">
      <div className="flex items-center gap-2 mb-2 text-indigo-500 border-b border-indigo-500/20 pb-2">
        <Terminal className="w-3 h-3" />
        <span className="font-bold tracking-widest">OMNI CORE FEED</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="opacity-80 hover:opacity-100 transition-opacity">
            <span className="text-indigo-600 mr-2">{'>'}</span>
            {log}
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
