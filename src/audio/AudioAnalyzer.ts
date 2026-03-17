export async function analizarAudio(file: File) {
 const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
 const ctx = new AudioContextClass()
 const buffer = await file.arrayBuffer()
 const audio = await ctx.decodeAudioData(buffer)
 
 const duracion = audio.duration
 const canales = audio.numberOfChannels
 
 return {
  duracion,
  canales,
  sampleRate: audio.sampleRate
 }
}
