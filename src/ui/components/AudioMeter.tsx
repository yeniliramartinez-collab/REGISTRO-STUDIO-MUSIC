import React, { useEffect, useRef } from "react"
import { arkheTheme } from "../../theme/arkheTheme"

export default function AudioMeter({ audioUrl }: { audioUrl: string | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!audioUrl || !canvasRef.current) return;

    const audio = new Audio(audioUrl);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    const source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    sourceRef.current = source;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = arkheTheme.negro;
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = arkheTheme.oro;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (sourceRef.current) sourceRef.current.disconnect();
      if (analyserRef.current) analyserRef.current.disconnect();
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  if (!audioUrl) return null;

  return (
    <div style={{ background: arkheTheme.negro, padding: "15px", borderRadius: "8px", border: `1px solid ${arkheTheme.vino}`, marginTop: "15px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", fontSize: "12px", color: arkheTheme.plata, fontWeight: "bold", letterSpacing: "1px" }}>
        <span>L</span>
        <span>VU METER</span>
        <span>R</span>
      </div>
      <canvas ref={canvasRef} width="300" height="60" style={{ width: "100%", height: "60px", borderRadius: "4px", background: "#000" }} />
      <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
        <button 
          onClick={() => {
            if (audioRef.current) {
              if (audioRef.current.paused) {
                audioRef.current.play();
              } else {
                audioRef.current.pause();
              }
            }
          }}
          style={{ background: arkheTheme.vino, color: arkheTheme.plata, border: `1px solid ${arkheTheme.oro}`, padding: "8px 20px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          Test Audio Meter
        </button>
      </div>
    </div>
  );
}
