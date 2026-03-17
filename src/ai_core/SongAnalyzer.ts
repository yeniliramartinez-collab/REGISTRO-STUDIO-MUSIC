export async function analizarCancion(file: File){
 const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
 const ctx = new AudioContextClass()
 const buffer = await file.arrayBuffer()
 const audio = await ctx.decodeAudioData(buffer)
 const calidad = audio.sampleRate >= 44100 ? "alta" : "baja"

 return {
  duracion: audio.duration,
  sampleRate: audio.sampleRate,
  canales: audio.numberOfChannels,
  calidad
 }
}
