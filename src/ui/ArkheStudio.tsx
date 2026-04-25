import React, { useState, useEffect, useRef } from "react"
import {ArkheController} from "../system/ArkheController"
import {buildMetadata} from "../distribution/MetadataEngine"
import AutomaticEvolutionSystem from "./AutomaticEvolutionSystem"
import { AssetPerformance } from "../types"
import WaveSurfer from "wavesurfer.js"

const system = new ArkheController()

export default function ArkheStudio(){
  const [analysis,setAnalysis] = useState<any>(null)
  const [songTitle, setSongTitle] = useState("")
  const [metadata, setMetadata] = useState<any>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isMastering, setIsMastering] = useState(false)
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);
  
  // Mock performance data for demonstration
  const [performance, setPerformance] = useState<AssetPerformance>({
    conversionScore: 4.2,
    engagement: 68,
    clicks: 1240,
    impressions: 115000,
    ctr: 1.07, // Below 1.2%
    daysActive: 15, // After 14 days
    status: 'needs_redesign'
  })

  const handleTriggerRedesign = () => {
    // Simulate redesign process
    setTimeout(() => {
      setPerformance(prev => ({
        ...prev,
        ctr: 2.5,
        clicks: prev.clicks + 500,
        impressions: prev.impressions + 20000,
        daysActive: 0,
        status: 'optimal'
      }))
    }, 3000)
  }

  async function upload(e:any){
    const file = e.target.files[0]
    if (!file) return;

    setSelectedFile(file)

    try {
      const result = await system.load(file)
      setAnalysis(result)

      const url = URL.createObjectURL(file);
      if (waveformRef.current) {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
        
        wavesurfer.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: "#5a2cff",
          progressColor: "#00ffa6",
          cursorColor: "#ffffff",
          barWidth: 2,
          height: 120,
        });
        
        wavesurfer.current.load(url);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function play(){
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    } else {
      system.play()
    }
  }

  async function master(){
    if (!selectedFile) return;
    
    setIsMastering(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/master', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Mastering failed');
      }

      const blob = await response.blob();
      const masteredUrl = URL.createObjectURL(blob);
      
      if (wavesurfer.current) {
        wavesurfer.current.load(masteredUrl);
      }
      
      // Update download logic if needed or set as active track
      // Here we just replace the selected file conceptually, but since it's a blob we can create a File
      const newFile = new File([blob], selectedFile.name.replace(/\.[^/.]+$/, "") + "_mastered.wav", { type: 'audio/wav' });
      setSelectedFile(newFile);
      
    } catch (err) {
      console.error(err);
      alert('Error during mastering process');
    } finally {
      setIsMastering(false);
    }
  }

  function handleGenerateMetadata(){
    if(!songTitle) return
    const data = buildMetadata(songTitle)
    setMetadata(data)
  }

  return(
    <div className="font-sans text-[#c0c0c0]">
      <h1 className="text-4xl font-black mb-8 tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-white drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
        ARKHÉ REGISTER STUDIO
      </h1>

      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-[#0a0a0c] border border-[#2B0011] text-[#c0c0c0] placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent text-sm tracking-wide"
          />
          <button 
            onClick={handleGenerateMetadata}
            className="px-6 py-2.5 bg-[#4b0021] text-[#d4af37] border border-[#d4af37]/30 rounded-lg hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all font-bold text-sm uppercase tracking-wider"
          >
            Generate Metadata
          </button>
        </div>

        {metadata && (
          <div className="bg-[#0a0a0c]/80 backdrop-blur-sm border border-[#00ffa6]/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,255,166,0.1)]">
            <h3 className="font-bold mb-4 text-[#00ffa6] tracking-wider uppercase text-sm">Generated Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div className="text-zinc-500">Title</div>
              <div className="text-[#c0c0c0] font-medium">{metadata.title}</div>
              <div className="text-zinc-500">Artist</div>
              <div className="text-[#c0c0c0] font-medium">{metadata.artist}</div>
              <div className="text-zinc-500">Author</div>
              <div className="text-[#c0c0c0] font-medium">{metadata.author}</div>
              <div className="text-zinc-500">Label</div>
              <div className="text-[#c0c0c0] font-medium">{metadata.label}</div>
              <div className="text-zinc-500">Year</div>
              <div className="text-[#c0c0c0] font-medium">{metadata.year}</div>
            </div>
          </div>
        )}

        <input 
          type="file" 
          accept="audio/*" 
          onChange={upload}
          className="block w-full text-sm text-zinc-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#d4af37]/10 file:text-[#d4af37] hover:file:bg-[#d4af37]/20 file:border file:border-[#d4af37]/50 transition-colors cursor-pointer"
        />
        
        {selectedFile && (
          <div className="mt-2 text-sm text-zinc-500 font-medium">
            Active Track: <span className="text-[#00ffa6] drop-shadow-[0_0_5px_rgba(0,255,166,0.4)]">{selectedFile.name}</span>
          </div>
        )}
        
        {/* Audio Visualizer */}
        <div 
          id="waveform" 
          ref={waveformRef} 
          className="mt-6 bg-[#0a0a0c] border border-[#2B0011] rounded-2xl p-4 w-full h-36 flex items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(75,0,33,0.4)]"
        >
          {!analysis && <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Upload audio to visualize</span>}
        </div>
      </div>

      {analysis && (
        <div className="bg-[#0a0a0c]/80 backdrop-blur-sm border border-[#2B0011] p-6 rounded-2xl mb-8">
          <h3 className="font-bold mb-4 text-[#d4af37] tracking-wider uppercase text-sm">Audio Analysis</h3>
          <div className="space-y-2">
            <p className="font-mono text-sm text-zinc-500 flex justify-between">
              <span>Peak</span>
              <span className="text-[#c0c0c0] font-medium">{analysis.peak.toFixed(4)}</span>
            </p>
            <p className="font-mono text-sm text-zinc-500 flex justify-between">
              <span>RMS</span>
              <span className="text-[#c0c0c0] font-medium">{analysis.rms.toFixed(4)}</span>
            </p>
            <p className="font-mono text-sm text-zinc-500 flex justify-between">
              <span>Duration</span>
              <span className="text-[#c0c0c0] font-medium">{analysis.duration.toFixed(2)}s</span>
            </p>
          </div>
        </div>
      )}

      {/* Automatic Evolution System */}
      <AutomaticEvolutionSystem 
        performance={performance} 
        onTriggerRedesign={handleTriggerRedesign} 
      />

      <div className="flex gap-4">
        <button 
          onClick={play}
          className="px-8 py-3 bg-[#0a0a0c] border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37]/10 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all font-bold text-sm uppercase tracking-wider"
        >
          Play
        </button>
        <button 
          onClick={master}
          disabled={!selectedFile || isMastering}
          className={`px-8 py-3 rounded-lg transition-all font-bold text-sm uppercase tracking-wider ${(!selectedFile || isMastering) ? 'bg-[#00ffa6]/10 text-[#00ffa6]/30 cursor-not-allowed border border-[#00ffa6]/10' : 'bg-transparent text-[#00ffa6] border border-[#00ffa6] hover:bg-[#00ffa6]/10 hover:shadow-[0_0_20px_rgba(0,255,166,0.5)]'}`}
        >
          {isMastering ? 'Mastering...' : 'AI Master'}
        </button>
        <button 
          onClick={() => {
            if (selectedFile) {
              const url = URL.createObjectURL(selectedFile);
              const a = document.createElement("a");
              a.href = url;
              a.download = selectedFile.name;
              a.click();
              URL.revokeObjectURL(url);
            }
          }}
          disabled={!selectedFile}
          className={`px-8 py-3 rounded-lg transition-all font-bold text-sm uppercase tracking-wider border ${!selectedFile ? 'border-zinc-800 text-zinc-600 cursor-not-allowed' : 'border-[#c0c0c0] text-[#c0c0c0] hover:bg-[#c0c0c0]/10 hover:shadow-[0_0_15px_rgba(192,192,192,0.4)]'}`}
        >
          Export WAV
        </button>
      </div>
    </div>
  )
}
