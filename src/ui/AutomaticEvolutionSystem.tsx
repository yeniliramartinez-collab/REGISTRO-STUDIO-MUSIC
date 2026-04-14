import React, { useState, useEffect } from 'react';
import { AssetPerformance } from '../types';

interface AutomaticEvolutionSystemProps {
  performance: AssetPerformance;
  onTriggerRedesign: () => void;
}

export default function AutomaticEvolutionSystem({ performance, onTriggerRedesign }: AutomaticEvolutionSystemProps) {
  const [isRedesigning, setIsRedesigning] = useState(performance.status === 'redesigning');

  const needsRedesign = performance.ctr < 1.2 && performance.daysActive >= 14;

  useEffect(() => {
    if (needsRedesign && performance.status !== 'redesigning') {
      // Automatically trigger redesign if conditions are met
      handleRedesign();
    }
  }, [needsRedesign, performance.status]);

  const handleRedesign = () => {
    setIsRedesigning(true);
    onTriggerRedesign();
    // Simulate redesign process
    setTimeout(() => {
      setIsRedesigning(false);
    }, 3000);
  };

  return (
    <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-zinc-900">Automatic Evolution System</h3>
        {isRedesigning ? (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full animate-pulse">
            Redesigning Asset...
          </span>
        ) : needsRedesign ? (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            Redesign Required
          </span>
        ) : (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
            Optimal Performance
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-zinc-100">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Conversion</div>
          <div className="text-xl font-semibold text-zinc-900">{performance.conversionScore.toFixed(1)}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-100">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Engagement</div>
          <div className="text-xl font-semibold text-zinc-900">{performance.engagement}%</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-100">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">CTR</div>
          <div className={`text-xl font-semibold ${performance.ctr < 1.2 ? 'text-red-600' : 'text-emerald-600'}`}>
            {performance.ctr.toFixed(2)}%
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-zinc-100">
          <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wider">Days Active</div>
          <div className="text-xl font-semibold text-zinc-900">{performance.daysActive}</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-zinc-500">
          <span className="font-medium text-zinc-700">{performance.clicks}</span> clicks / <span className="font-medium text-zinc-700">{performance.impressions}</span> impressions
        </div>
        <button
          onClick={handleRedesign}
          disabled={isRedesigning}
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            isRedesigning 
              ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
              : 'bg-zinc-900 text-white hover:bg-black'
          }`}
        >
          {isRedesigning ? 'Evolving...' : 'Force Evolution'}
        </button>
      </div>
    </div>
  );
}
