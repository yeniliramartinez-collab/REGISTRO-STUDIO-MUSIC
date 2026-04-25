import React, { useState, useEffect } from 'react';
import { vaultEngine } from '../system/VaultEngine';
import { strategistEngine } from '../system/StrategistEngine';
import { VaultAsset, NarrativeAngle } from '../types';

export default function VaultView() {
  const [assets, setAssets] = useState<VaultAsset[]>([]);
  const [currentAngle, setCurrentAngle] = useState<NarrativeAngle | null>(null);
  const [isGeneratingAngle, setIsGeneratingAngle] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAssets(vaultEngine.getVaultAssets());
    setCurrentAngle(strategistEngine.getCurrentAngle());
  };

  const handleGenerateAngle = async () => {
    setIsGeneratingAngle(true);
    const angle = await strategistEngine.generateDailyAngle();
    setCurrentAngle(angle);
    setIsGeneratingAngle(false);
  };

  const handleMockGenerateAsset = () => {
    if (!currentAngle) {
      alert("Please generate a Narrative Angle of the Day first to prevent cannibalization.");
      return;
    }

    const types: ('video' | 'image' | 'audio_snippet')[] = ['video', 'image', 'audio_snippet'];
    const randomType = types[Math.floor(Math.random() * types.length)];

    const newAsset: VaultAsset = {
      id: crypto.randomUUID(),
      songId: "song-" + Math.floor(Math.random() * 1000),
      title: `Generated ${randomType} asset`,
      type: randomType,
      contentUrl: "#",
      narrativeAngle: currentAngle.angle,
      priorityScore: 0,
      status: 'vaulted'
    };

    vaultEngine.addToVault(newAsset);
    loadData();
  };

  const handlePublish = (id: string) => {
    vaultEngine.publishAsset(id);
    loadData();
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Strategist Section */}
      <div className="bg-[#0a0a0c] text-[#c0c0c0] p-6 rounded-2xl border border-[#2B0011] shadow-[0_0_30px_rgba(75,0,33,0.3)]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2 text-[#d4af37] uppercase tracking-wider">
              🧠 OMNI Strategist
              <span className="text-xs bg-[#4b0021] text-[#00ffa6] px-2 py-1 rounded border border-[#00ffa6]/30 font-mono drop-shadow-[0_0_5px_rgba(0,255,166,0.3)]">Cannibalization Shield Active</span>
            </h2>
            <p className="text-zinc-500 text-sm mt-1">Defines the daily narrative to ensure unified identity across all generated assets. AI predictions prevent canonical violations.</p>
          </div>
          <button 
            onClick={handleGenerateAngle}
            disabled={isGeneratingAngle}
            className="px-6 py-2.5 bg-transparent border border-[#00ffa6] hover:bg-[#00ffa6]/10 text-[#00ffa6] font-bold rounded-lg text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(0,255,166,0.3)] transition-all flex-shrink-0"
          >
            {isGeneratingAngle ? 'Analyzing Trends...' : 'Define Daily Angle'}
          </button>
        </div>

        {currentAngle ? (
          <div className="bg-[#050505] p-5 rounded-xl border border-[#4b0021]">
            <div className="text-xs text-[#d4af37] font-mono mb-2 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ffa6] shadow-[0_0_5px_#00ffa6] animate-pulse"></span>
              NARRATIVE ANGLE OF THE DAY
            </div>
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#c0c0c0] mb-2">{currentAngle.angle}</h3>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{currentAngle.description}</p>
            <div className="flex flex-wrap gap-2">
              {currentAngle.keywords.map(kw => (
                <span key={kw} className="text-xs bg-[#1a1a24] border border-[#d4af37]/30 text-[#d4af37] px-3 py-1.5 rounded-lg tracking-wide uppercase">#{kw}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#050505] p-6 rounded-xl border border-zinc-800 border-dashed text-center">
            <p className="text-zinc-600 text-sm tracking-wide">No narrative angle defined for today. Generate one to initialize the strategy matrix.</p>
          </div>
        )}
      </div>

      {/* Vault Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">📦 Genesis Vault</h2>
          <button 
            onClick={handleMockGenerateAsset}
            className="px-6 py-2.5 bg-transparent border border-[#d4af37] hover:bg-[#d4af37]/10 text-[#d4af37] font-bold rounded-lg text-sm uppercase tracking-wider shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
          >
            + Generate Asset
          </button>
        </div>

        <div className="grid gap-4">
          {assets.length === 0 ? (
            <div className="bg-[#0a0a0c] p-8 rounded-2xl border border-zinc-900 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              <p className="text-zinc-600 tracking-wide uppercase text-sm">The vault is empty. Generate assets aligned with today's master narrative.</p>
            </div>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="group bg-[#0a0a0c] p-5 rounded-xl border border-[#2a2a35] hover:border-[#4b0021] flex items-center justify-between transition-all hover:shadow-[0_0_25px_rgba(75,0,33,0.3)]">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-black text-xs border
                    ${asset.type === 'video' ? 'bg-[#050505] border-[#00ffa6] text-[#00ffa6] shadow-[0_0_10px_rgba(0,255,166,0.2)]' : 
                      asset.type === 'image' ? 'bg-[#050505] border-[#d4af37] text-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 
                      'bg-[#050505] border-white text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'}`}
                  >
                    {asset.type.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-white tracking-wide group-hover:text-[#d4af37] transition-colors">{asset.title}</h4>
                    <div className="flex items-center gap-3 text-xs mt-1.5 font-mono">
                      <span className="text-zinc-500">Angle: <span className="font-bold text-[#c0c0c0]">{asset.narrativeAngle}</span></span>
                      <span className="text-zinc-700">|</span>
                      <span className="text-zinc-500">Score: <span className="font-bold text-[#00ffa6] drop-shadow-[0_0_3px_#00ffa6]">{asset.priorityScore}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {asset.status === 'scheduled' && asset.scheduledFor && (
                    <div className="flex gap-2">
                      {asset.scheduledFor.map((schedule, idx) => (
                        <div key={idx} className="text-[10px] uppercase bg-[#1a1a24] border border-[#2a2a35] px-3 py-1.5 rounded flex flex-col items-center">
                          <span className="font-bold text-[#c0c0c0]">{schedule.platform}</span>
                          <span className="text-[#00ffa6]">{new Date(schedule.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-[10px] font-black rounded uppercase tracking-widest border
                      ${asset.status === 'vaulted' ? 'bg-[#1a1a24] border-zinc-700 text-zinc-400' : 
                        asset.status === 'scheduled' ? 'bg-[#4b0021] border-[#d4af37]/30 text-[#d4af37]' : 
                        'bg-[#050505] border-[#00ffa6] text-[#00ffa6]'}`}
                    >
                      {asset.status}
                    </span>
                    {asset.status === 'scheduled' && (
                      <button 
                        onClick={() => handlePublish(asset.id)}
                        className="text-[10px] uppercase tracking-wider text-[#00ffa6] hover:text-white font-bold transition-colors drop-shadow-[0_0_5px_#00ffa6]"
                      >
                        Publish Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
