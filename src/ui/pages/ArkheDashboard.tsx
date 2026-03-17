import React, { useState, useEffect } from "react"
import CollapsiblePanel from "../components/CollapsiblePanel"
import AudioStudio from "../components/AudioStudio"
import AudioUploader from "../components/AudioUploader"
import { ArkheLibraryEngine, Obra } from "../../library/ArkheLibraryEngine"
import { BatchRegisterEngine } from "../../registro/BatchRegisterEngine"
import { generarMidi } from "../../ai/MelodyGenerator"
import { blindaje } from "../../security/BlockchainProof"
import { arkheTheme } from "../../theme/arkheTheme"
import { vozArkhe } from "../../core/vozArkhe"
import { analizarAudio } from "../../audio/AudioAnalyzer"
import { masterRapido } from "../../audio/masterRapido"

export default function ArkheDashboard(){
  
  const [obras, setObras] = useState<Obra[]>([]);
  const [lote, setLote] = useState(BatchRegisterEngine.estadoLote());
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [analisis, setAnalisis] = useState<any>(null);
  const [hookInfo, setHookInfo] = useState<any>(null);
  const [masterRecomendado, setMasterRecomendado] = useState<string>("");

  useEffect(() => {
    setObras(ArkheLibraryEngine.listar());
    vozArkhe("Bienvenido arquitecto. Puedes subir tu canción para análisis");
  }, []);

  const handleMidi = () => {
    const midi = generarMidi()
    const link = document.createElement("a")
    link.href = midi
    link.download = "melodia.mid"
    link.click()
  }

  const handleAudioUpload = async (file: File) => {
    vozArkhe("Canción recibida. Analizando archivo");
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    try {
      const datos = await analizarAudio(file);
      setAnalisis(datos);

      if(datos.sampleRate < 44100){
        setTimeout(() => vozArkhe("Advertencia. Calidad de audio baja"), 3000);
      } else {
        setTimeout(() => vozArkhe("La canción tiene calidad profesional"), 3000);
      }
      
      // Simular masterización rápida
      setTimeout(() => vozArkhe("Aplicando masterización básica"), 6000);
      
      // En la vida real aquí haríamos:
      // const buffer = await file.arrayBuffer()
      // const audioData = await new AudioContext().decodeAudioData(buffer)
      // masterRapido(audioData.getChannelData(0))

    } catch (error) {
      console.error("Error analizando audio", error);
      vozArkhe("Hubo un error al analizar el archivo de audio.");
    }
  }

  const handleBlindaje = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      vozArkhe("Iniciando blindaje blockchain.");
      const result = await blindaje(e.target.files[0]);
      console.log("OTS Proof:", result.otsProof);
      vozArkhe("Arquitecto, la obra está lista para registro. Hash generado exitosamente.");
      alert(`Hash SHA256: ${result.hash}`);
    }
  }

 return(
  <div style={{
      padding:"20px", 
      maxWidth: "1200px", 
      margin: "0 auto", 
      minHeight: "100vh"
  }}>
   
   <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", borderBottom: `1px solid #2a2f45`, paddingBottom: "20px" }}>
      <h1 style={{ margin: 0, fontSize: "28px", letterSpacing: "3px", color: "#ffcc00", textShadow: "0 0 10px #ffcc00" }}>ARKHÉ STUDIO</h1>
      <div style={{ display: "flex", gap: "20px", fontSize: "14px" }}>
          <span>Biblioteca: {obras.length}</span>
          <span>Lote Registro: <strong style={{color: "#ffcc00"}}>{lote.actual} / {lote.maximo}</strong></span>
      </div>
   </header>

   <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
       
       {/* Top Row: Audio Studio (Full Width) */}
       <CollapsiblePanel title="🎧 AUDIO STUDIO">
        <AudioStudio url={audioUrl}/>
        <div style={{ marginTop: "20px" }}>
            <AudioUploader onLoad={handleAudioUpload} />
        </div>
        {analisis && (
          <div className="panel" style={{ marginTop: "15px", padding: "10px", fontSize: "12px", display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <span><strong>Duración:</strong> {analisis.duracion.toFixed(2)}s</span>
            <span><strong>Canales:</strong> {analisis.canales}</span>
            <span><strong>Sample Rate:</strong> {analisis.sampleRate} Hz</span>
            <span><strong>Calidad:</strong> <span style={{ color: analisis.sampleRate >= 44100 ? '#00ffc3' : '#ff4444' }}>{analisis.sampleRate >= 44100 ? 'ALTA' : 'BAJA'}</span></span>
          </div>
        )}
       </CollapsiblePanel>

       {/* Bottom Row: Grid Layout */}
       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
           
           <CollapsiblePanel title="🧠 ANÁLISIS IA & MASTER">
            <div style={{ fontSize: "14px" }}>
                <p>Motor analiza letra y música.</p>
                <button onClick={handleMidi} style={{ width: "100%", marginTop: "10px" }}>
                  Generar Letra + MIDI
                </button>
                
                <hr style={{ borderColor: "#2a2f45", margin: "20px 0" }} />
                
                <p>Motores de masterización listos.</p>
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button style={{ flex: 1 }}>Master 1</button>
                    <button style={{ flex: 1 }}>Master 2</button>
                </div>
            </div>
           </CollapsiblePanel>

           <CollapsiblePanel title="📚 BIBLIOTECA">
            <div style={{ fontSize: "14px", maxHeight: "300px", overflowY: "auto" }}>
                {obras.length === 0 ? (
                    <p>No hay obras en la biblioteca.</p>
                ) : (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {obras.map(obra => (
                            <li key={obra.id} style={{ padding: "10px", borderBottom: `1px solid #2a2f45` }}>
                                <strong style={{ color: "#ffcc00" }}>{obra.titulo}</strong>
                                <div style={{ fontSize: "12px" }}>{obra.estado}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
           </CollapsiblePanel>

           <CollapsiblePanel title="📦 LOTE REGISTRO">
            <div style={{ fontSize: "14px" }}>
                <div style={{ fontSize: "32px", color: "#ffcc00", textShadow: "0 0 10px #ffcc00", fontWeight: "bold", textAlign: "center", margin: "20px 0" }}>
                    {lote.actual} / {lote.maximo}
                </div>
                <p style={{ textAlign: "center" }}>Obras listas para INDAUTOR</p>
                
                <div style={{ marginTop: "20px", borderTop: `1px solid #2a2f45`, paddingTop: "15px" }}>
                    <h4 style={{ color: "#ffcc00", marginBottom: "10px" }}>Blindaje Blockchain (OTS)</h4>
                    <input type="file" onChange={handleBlindaje} style={{ fontSize: "12px", width: "100%" }} />
                </div>
            </div>
           </CollapsiblePanel>

       </div>
   </div>

  </div>
 )
}
