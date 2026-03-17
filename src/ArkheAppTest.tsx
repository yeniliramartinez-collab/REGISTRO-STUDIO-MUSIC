import React, { useState } from "react"
import { hablar } from "./voice/ArkheVoice"
import { analizarAudio } from "./audio/AudioAnalyzer"

export default function ArkheAppTest(){
 const [audio,setAudio] = useState<string | null>(null)
 const [analisis, setAnalisis] = useState<any>(null)

 const subirCancion = async (e:any)=>{
  const file = e.target.files[0]
  if(!file) return
  const url = URL.createObjectURL(file)
  setAudio(url)
  
  hablar("Canción recibida. Analizando archivo.")

  try {
    const datos = await analizarAudio(file)
    setAnalisis(datos)

    if(datos.sampleRate < 44100){
      // Pequeño delay para que no se encime con el primer mensaje
      setTimeout(() => hablar("Advertencia. Calidad de audio baja."), 3000)
    } else {
      setTimeout(() => hablar("La canción tiene buena calidad."), 3000)
    }
    
    console.log(datos)
  } catch (error) {
    console.error("Error analizando audio:", error)
  }
 }

 const reproducir = ()=>{
  if(!audio){
   hablar("Primero debes subir una canción")
   return
  }
  const player = new Audio(audio)
  player.play()
  hablar("Reproduciendo canción para revisión")
 }

 const enviarBiblioteca = ()=>{
  hablar("Canción enviada a biblioteca")
 }

 const enviarRegistro = ()=>{
  hablar("Canción preparada para registro legal")
 }

 return(
  <div style={{
   height:"100vh",
   background:"#0b0b0f",
   color:"white",
   padding:"40px",
   fontFamily:"sans-serif"
  }}>
   <h1>ARKHÉ STUDIO</h1>
   <p>Sube tu canción para análisis y registro</p>
   
   <input
    type="file"
    accept="audio/*"
    onChange={subirCancion}
    style={{ marginBottom: "20px" }}
   />

   {analisis && (
     <div style={{ background: "#4a0f1e", padding: "15px", borderRadius: "8px", marginBottom: "20px", maxWidth: "400px" }}>
       <h3 style={{ marginTop: 0, color: "#d4af37" }}>Resultados del Análisis:</h3>
       <p><strong>Duración:</strong> {analisis.duracion.toFixed(2)}s</p>
       <p><strong>Canales:</strong> {analisis.canales}</p>
       <p><strong>Sample Rate:</strong> {analisis.sampleRate} Hz</p>
     </div>
   )}

   <div style={{ display: "flex", gap: "10px", marginTop:"20px" }}>
    <button 
      onClick={reproducir}
      style={{ background: "#d4af37", color: "#000", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
    >
     ▶ Escuchar canción
    </button>

    <button 
      onClick={enviarBiblioteca}
      style={{ background: "#4a0f1e", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
    >
     📚 Enviar a biblioteca
    </button>

    <button 
      onClick={enviarRegistro}
      style={{ background: "#4a0f1e", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
    >
     📦 Preparar registro
    </button>
   </div>
  </div>
 )
}
