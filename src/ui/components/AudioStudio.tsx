import React, { useEffect, useRef } from "react"
import WaveSurfer from "wavesurfer.js"

export default function AudioStudio({url}: {url?: string}){
 const containerRef = useRef<HTMLDivElement>(null);
 const wsRef = useRef<WaveSurfer | null>(null);

 useEffect(()=>{
  if (!containerRef.current) return;

  const ws = WaveSurfer.create({
   container: containerRef.current,
   waveColor:"#555",
   progressColor:"#ffcc00",
   height:120,
   cursorColor: "#fff",
   barWidth: 2,
   barGap: 1,
   barRadius: 2,
  })
  
  wsRef.current = ws;

  if (url) {
    ws.load(url)
    ws.on("ready",()=>{
     // ws.play()
    })
  }

  return () => {
    ws.destroy();
  }
 },[url])

 const handlePlayPause = () => {
    if (wsRef.current) {
        wsRef.current.playPause();
    }
 }

 return(
  <div>
   <div ref={containerRef} id="waveform" style={{ marginBottom: "15px" }}></div>
   <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      <button onClick={handlePlayPause}>
        Play / Pause
      </button>
   </div>
  </div>
 )
}
