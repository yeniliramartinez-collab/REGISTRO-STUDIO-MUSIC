export function decidirMasterizacion(analisis: any){
 if(analisis.sampleRate < 44100){
  return "MASTER_ENGINE_2"
 }
 return "MASTER_ENGINE_1"
}
