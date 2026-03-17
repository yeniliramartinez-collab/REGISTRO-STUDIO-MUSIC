import { analizarCancion } from "./SongAnalyzer"
import { detectarHook } from "./HookDetector"
import { hablar } from "./VoiceAssistant"
import { decidirMasterizacion } from "./MasterDecisionEngine"

export async function procesarCancion(file: File){
 hablar("Arquitecto, analizando canción")

 const analisis = await analizarCancion(file)
 const hook: any = await detectarHook(file)
 const masterRecomendado = decidirMasterizacion(analisis)

 if(analisis.calidad === "baja"){
  setTimeout(() => hablar("La calidad de audio es baja, recomiendo masterización profunda."), 2000)
 } else {
  setTimeout(() => hablar("La calidad de audio es óptima. Recomiendo masterización ligera."), 2000)
 }

 if(hook.detectado){
  setTimeout(() => {
    hablar(`Hook potencial detectado en el segundo ${Math.round(hook.inicio)}.`);
    setTimeout(() => hablar("¿Desea enviar la obra a registro?"), 4000);
  }, 6000)
 }

 return {
  analisis,
  hook,
  masterRecomendado
 }
}
