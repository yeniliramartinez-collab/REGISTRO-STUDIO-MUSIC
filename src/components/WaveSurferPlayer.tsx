import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface WaveSurferPlayerProps {
  url: string;
}

export default function WaveSurferPlayer({ url }: WaveSurferPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#4f46e5',
      progressColor: '#818cf8',
      cursorColor: '#c7d2fe',
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      height: 48,
    });

    ws.load(url);

    ws.on('ready', () => {
      // Ready to play
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));

    wavesurferRef.current = ws;

    return () => {
      ws.destroy();
    };
  }, [url]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  const toggleMute = () => {
    const ws = wavesurferRef.current;
    if (ws) {
      ws.setMuted(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800">
      <button 
        onClick={togglePlay}
        className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors shrink-0"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
      </button>
      
      <div ref={containerRef} className="flex-1" />
      
      <button 
        onClick={toggleMute}
        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
