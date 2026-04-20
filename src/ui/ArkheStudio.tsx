import React,{useState} from "react"
import {ArkheController} from "../system/ArkheController"
import {buildMetadata} from "../distribution/MetadataEngine"
import AutomaticEvolutionSystem from "./AutomaticEvolutionSystem"
import { AssetPerformance } from "../types"

const system = new ArkheController()

export default function ArkheStudio(){
  const [analysis,setAnalysis] = useState<any>(null)
  const [songTitle, setSongTitle] = useState("")
  const [metadata, setMetadata] = useState<any>(null)
  
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
    const result = await system.load(file)
    setAnalysis(result)
  }

  function play(){
    system.play()
  }

  function master(){
    system.master()
  }

  function handleGenerateMetadata(){
    if(!songTitle) return
    const data = buildMetadata(songTitle)
    setMetadata(data)
  }

  return(
    <div className="font-sans">
      <h1 className="text-3xl font-bold mb-8 tracking-tight">ARKHE REGISTER STUDIO</h1>

      <div className="mb-8 space-y-4">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Song Title"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-full border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
          <button 
            onClick={handleGenerateMetadata}
            className="px-6 py-2.5 bg-zinc-900 text-white rounded-full hover:bg-black transition-colors font-medium text-sm"
          >
            Generate Metadata
          </button>
        </div>

        {metadata && (
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
            <h3 className="font-semibold mb-4 text-emerald-900">Generated Metadata</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono">
              <div className="text-emerald-700">Title</div>
              <div className="text-emerald-900 font-medium">{metadata.title}</div>
              <div className="text-emerald-700">Artist</div>
              <div className="text-emerald-900 font-medium">{metadata.artist}</div>
              <div className="text-emerald-700">Author</div>
              <div className="text-emerald-900 font-medium">{metadata.author}</div>
              <div className="text-emerald-700">Label</div>
              <div className="text-emerald-900 font-medium">{metadata.label}</div>
              <div className="text-emerald-700">Year</div>
              <div className="text-emerald-900 font-medium">{metadata.year}</div>
            </div>
          </div>
        )}

        <input 
          type="file" 
          accept="audio/*" 
          onChange={upload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-900 hover:file:bg-zinc-200 transition-colors cursor-pointer"
        />
      </div>

      {analysis && (
        <div className="bg-zinc-50 border border-zinc-200 p-6 rounded-2xl mb-8">
          <h3 className="font-semibold mb-4 text-zinc-900">Audio Analysis</h3>
          <div className="space-y-2">
            <p className="font-mono text-sm text-zinc-600 flex justify-between">
              <span>Peak</span>
              <span className="text-zinc-900 font-medium">{analysis.peak.toFixed(4)}</span>
            </p>
            <p className="font-mono text-sm text-zinc-600 flex justify-between">
              <span>RMS</span>
              <span className="text-zinc-900 font-medium">{analysis.rms.toFixed(4)}</span>
            </p>
            <p className="font-mono text-sm text-zinc-600 flex justify-between">
              <span>Duration</span>
              <span className="text-zinc-900 font-medium">{analysis.duration.toFixed(2)}s</span>
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
          className="px-6 py-2.5 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors font-medium text-sm"
        >
          Play
        </button>
        <button 
          onClick={master}
          className="px-6 py-2.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium text-sm"
        >
          Master
        </button>
      </div>
    </div>
  )
}
