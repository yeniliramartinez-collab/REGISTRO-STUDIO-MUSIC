import { analizarLoudness } from "./LoudnessAnalyzer"
import { normalizar } from "./AudioProcessor"
import { limiter } from "./Limiter"
import { aplicarEQBasica } from "./EQEngine"

export async function masterizar(audioBuffer: AudioBuffer){
 const analisis = await analizarLoudness(audioBuffer)
 let buffer = audioBuffer.getChannelData(0)
 
 buffer = normalizar(buffer)
 buffer = aplicarEQBasica(buffer)
 buffer = limiter(buffer)
 
 return {
  buffer,
  analisis
 }
}
