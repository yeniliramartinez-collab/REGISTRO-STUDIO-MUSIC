export async function analizarLoudness(audioBuffer: AudioBuffer){
 const channel = audioBuffer.getChannelData(0)
 let sum = 0
 for(let i=0;i<channel.length;i++){
  sum += channel[i]*channel[i]
 }
 const rms = Math.sqrt(sum/channel.length)
 const lufs = 20 * Math.log10(rms)
 return {
  rms,
  lufs
 }
}
