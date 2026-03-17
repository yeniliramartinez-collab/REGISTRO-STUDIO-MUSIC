import { encodeWAV } from "./wavExporter";

export function masterBasico(buffer: Float32Array){
 let peak = 0
 for(let i=0;i<buffer.length;i++){
  if(Math.abs(buffer[i]) > peak){
   peak = Math.abs(buffer[i])
  }
 }
 const gain = 0.9 / peak
 for(let i=0;i<buffer.length;i++){
  buffer[i] *= gain
 }
 return buffer
}

export async function masterAudio(file: File): Promise<File> {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const ctx = new AudioContextClass();
  const buffer = await file.arrayBuffer();
  const audio = await ctx.decodeAudioData(buffer);
  
  const channelData = audio.getChannelData(0);
  const masteredData = masterBasico(channelData);
  
  const blob = encodeWAV(masteredData, audio.sampleRate);
  return new File([blob], file.name.replace(/\.[^/.]+$/, "") + "_mastered.wav", { type: "audio/wav" });
}
