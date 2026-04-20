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
    <div className="space-y-8">
      {/* Strategist Section */}
      <div className="bg-zinc-900 text-white p-6 rounded-2xl border border-zinc-800">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🧠 GPT Strategist
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full font-mono">Cannibalization Control</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">Defines the daily narrative to ensure unified identity across all generated assets.</p>
          </div>
          <button 
            onClick={handleGenerateAngle}
            disabled={isGeneratingAngle}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-medium rounded-full text-sm transition-colors"
          >
            {isGeneratingAngle ? 'Analyzing Trends...' : 'Define Daily Angle'}
          </button>
        </div>

        {currentAngle ? (
          <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
            <div className="text-xs text-emerald-400 font-mono mb-1">NARRATIVE ANGLE OF THE DAY</div>
            <h3 className="text-2xl font-bold text-white mb-2">{currentAngle.angle}</h3>
            <p className="text-zinc-300 text-sm mb-3">{currentAngle.description}</p>
            <div className="flex flex-wrap gap-2">
              {currentAngle.keywords.map(kw => (
                <span key={kw} className="text-xs bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md">#{kw}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-800/30 p-6 rounded-xl border border-zinc-700 border-dashed text-center">
            <p className="text-zinc-500 text-sm">No narrative angle defined for today. Generate one to start creating aligned assets.</p>
          </div>
        )}
      </div>

      {/* Vault Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-zinc-900">📦 Content Vault</h2>
          <button 
            onClick={handleMockGenerateAsset}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-medium rounded-full text-sm transition-colors"
          >
            + Generate Mock Asset
          </button>
        </div>

        <div className="grid gap-4">
          {assets.length === 0 ? (
            <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-200 text-center">
              <p className="text-zinc-500">The vault is empty. Generate assets aligned with today's narrative.</p>
            </div>
          ) : (
            assets.map(asset => (
              <div key={asset.id} className="bg-white p-4 rounded-xl border border-zinc-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs
                    ${asset.type === 'video' ? 'bg-blue-100 text-blue-700' : 
                      asset.type === 'image' ? 'bg-purple-100 text-purple-700' : 
                      'bg-amber-100 text-amber-700'}`}
                  >
                    {asset.type.substring(0, 3).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">{asset.title}</h4>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="text-zinc-500">Angle: <span className="font-medium text-zinc-700">{asset.narrativeAngle}</span></span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-zinc-500">Score: <span className="font-medium text-zinc-700">{asset.priorityScore}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {asset.status === 'scheduled' && asset.scheduledFor && (
                    <div className="flex gap-2">
                      {asset.scheduledFor.map((schedule, idx) => (
                        <div key={idx} className="text-xs bg-zinc-100 px-2 py-1 rounded-md flex flex-col items-center">
                          <span className="font-medium text-zinc-700">{schedule.platform}</span>
                          <span className="text-zinc-500">{new Date(schedule.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full
                      ${asset.status === 'vaulted' ? 'bg-zinc-100 text-zinc-600' : 
                        asset.status === 'scheduled' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-blue-100 text-blue-700'}`}
                    >
                      {asset.status.toUpperCase()}
                    </span>
                    {asset.status === 'scheduled' && (
                      <button 
                        onClick={() => handlePublish(asset.id)}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
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
