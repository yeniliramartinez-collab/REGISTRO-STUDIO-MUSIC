import React, { useState, useEffect, useRef } from "react"
import CollapsiblePanel from "../components/CollapsiblePanel"
import AudioUploader from "../components/AudioUploader"
import { ArkheLibraryEngine, Obra } from "../../library/ArkheLibraryEngine"
import { BatchRegisterEngine } from "../../registro/BatchRegisterEngine"
import { generarMidi } from "../../ai/MelodyGenerator"
import { blindaje } from "../../security/BlockchainProof"
import { vozArkhe } from "../../core/vozArkhe"
import { analizarAudio } from "../../audio/audioAnalyzer"
import { master1 } from "../../audio/master1"
import { master2 } from "../../audio/master2"
import { encodeWAV } from "../../audio/wavExporter"
import { detectarClipping } from "../../audio/clippingDetector"
import { LegalEngine } from "../../legal/LegalEngine"
import { OriginalityEngine } from "../../audio/OriginalityEngine"
import WaveSurfer from "wavesurfer.js"

export default function ArkheDashboard(){
  
  const [obras, setObras] = useState<Obra[]>([]);
  const [obraActual, setObraActual] = useState<Obra | null>(null);
  const [lote, setLote] = useState(BatchRegisterEngine.estadoLote());
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [analisis, setAnalisis] = useState<any>(null);
  const [audioProcesado, setAudioProcesado] = useState<AudioBuffer | null>(null);
  const [mensaje, setMensaje] = useState<string>("");
  const [clipping, setClipping] = useState<boolean | null>(null);
  const [letra, setLetra] = useState<string>("");
  const [originalidad, setOriginalidad] = useState<any>(null);
  
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    const loadedObras = ArkheLibraryEngine.listar();
    setObras(loadedObras);
    if (loadedObras.length > 0) {
      setObraActual(loadedObras[loadedObras.length - 1]);
    }
    vozArkhe("Bienvenido arquitecto. Puedes subir tu canción para análisis");
    
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, []);

  const handleMidi = () => {
    const midi = generarMidi()
    const link = document.createElement("a")
    link.href = midi
    link.download = "melodia.mid"
    link.click()
  }

  const cargarWaveform = (url: string) => {
    if (waveformRef.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
      
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#5a2cff",
        progressColor: "#00ffa6",
        cursorColor: "#ffffff",
        barWidth: 2,
        height: 120,
      });
      
      wavesurfer.current.load(url);
    }
  }

  const handleAudioUpload = async (file: File) => {
    vozArkhe("Canción recibida. Lista para análisis.");
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFile(file);
    setAnalisis(null);
    setAudioProcesado(null);
    setMensaje("");
    setClipping(null);
    setOriginalidad(null);
    
    cargarWaveform(url);
  }

  const analizar = async () => {
    if (!audioFile) return;
    
    vozArkhe("Analizando mezcla e integridad...");
    
    try {
      const datos = await analizarAudio(audioFile);
      setAnalisis(datos);
      
      const ctx = new AudioContext();
      const buffer = await audioFile.arrayBuffer();
      const audio = await ctx.decodeAudioData(buffer);
      const hasClipping = detectarClipping(audio);
      setClipping(hasClipping);

      const orig = await OriginalityEngine.analizarSimilitud(audioFile);
      setOriginalidad(orig);

      if(orig.alertas.length > 0) {
        setTimeout(() => vozArkhe("Atención. Se han detectado similitudes con otras obras."), 2500);
      } else if(hasClipping){
        setTimeout(() => vozArkhe("Advertencia. La canción tiene clipping. Activando limitador."), 2500);
      } else if(datos.rms < -18){
        setTimeout(() => vozArkhe("La mezcla tiene volumen bajo. Normalizando volumen."), 2500);
      } else {
        setTimeout(() => vozArkhe("La mezcla está equilibrada. Calidad profesional."), 2500);
      }
    } catch (error) {
      console.error("Error analizando audio", error);
      vozArkhe("Hubo un error al analizar el archivo de audio.");
    }
  }

  const ejecutarMaster1 = async () => {
    if (!audioFile) return;
    vozArkhe("Analizando mezcla. Detectando picos y rango dinámico. Aplicando masterización inicial.");
    
    try {
      const ctx = new AudioContext();
      const buffer = await audioFile.arrayBuffer();
      const audio = await ctx.decodeAudioData(buffer);
      
      const procesado = master1(audio);
      setAudioProcesado(procesado);
      setMensaje("Masterización 1 terminada");
    } catch (error) {
      console.error("Error en master 1", error);
    }
  }

  const ejecutarMaster2 = () => {
    if (!audioProcesado) {
        vozArkhe("Primero debes aplicar Master 1");
        return;
    }
    vozArkhe("Aplicando masterización avanzada. Optimizando rango dinámico. Preparando audio en calidad master.");
    
    const procesado = master2(audioProcesado);
    setAudioProcesado(procesado);
    setMensaje("Super Master aplicado");
  }

  const escucharResultado = () => {
    if (!audioProcesado) return;
    const ctx = new AudioContext();
    const source = ctx.createBufferSource();
    source.buffer = audioProcesado;
    source.connect(ctx.destination);
    source.start();
  }

  const handleExport = () => {
    if (!audioProcesado) {
      vozArkhe("Primero debes aplicar un master.");
      return;
    }
    vozArkhe("Exportando master final en alta resolución.");
    
    const channelData = audioProcesado.getChannelData(0);
    const blob = encodeWAV(channelData, audioProcesado.sampleRate);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MASTER_FINAL_24bit_48kHz.wav";
    a.click();
  }

  const handleCrearObra = async () => {
    if (!letra) {
      alert("Necesitas al menos una letra para crear la obra.");
      return;
    }
    if (!audioUrl) {
      alert("Necesitas subir y analizar un audio para crear la obra.");
      return;
    }
    vozArkhe("Generando hash y timestamp. Creando obra legal.");
    const nuevaObra = ArkheLibraryEngine.crearNuevaObra("Nueva Obra " + (obras.length + 1), "Autor Principal", letra, audioUrl);
    setObras(ArkheLibraryEngine.listar());
    setObraActual(nuevaObra);
    setMensaje("Obra registrada internamente con éxito.");
  }

  const handleFijarVersion = async () => {
    if (!obraActual) return;
    if (!letra) {
      alert("Necesitas al menos una letra para fijar la versión.");
      return;
    }
    if (!audioUrl) {
      alert("Necesitas un audio para fijar la versión.");
      return;
    }
    vozArkhe("Fijando nueva versión de la obra.");
    const obraActualizada = ArkheLibraryEngine.agregarVersion(obraActual.id, letra, audioUrl);
    if (obraActualizada) {
      setObras(ArkheLibraryEngine.listar());
      setObraActual(obraActualizada);
      
      const ultimaVersion = obraActualizada.versiones[obraActualizada.versiones.length - 1];
      const versionAnterior = obraActual.versiones[obraActual.versiones.length - 1];
      
      if (ultimaVersion.hash === versionAnterior.hash) {
        setMensaje("No hay cambios en el contenido. No se creó una nueva versión.");
      } else {
        setMensaje(`Versión ${ultimaVersion.versionNumber} fijada con éxito.`);
      }
    }
  }

  const handleGenerarPaquete = async () => {
    if (!obraActual) {
      alert("No hay una obra seleccionada.");
      return;
    }
    vozArkhe("Empaquetando obra completa para registro y distribución.");
    try {
      const zipBlob = await LegalEngine.empaquetarObraCompleta(obraActual);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${obraActual.titulo.replace(/\s+/g, '_')}_PaqueteLegal.zip`;
      a.click();
      setMensaje("Paquete legal generado.");
    } catch (e) {
      console.error(e);
      alert("Error al generar el paquete legal.");
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
       <CollapsiblePanel title="🎧 AUDIO STUDIO & PIPELINE LEGAL">
        <div style={{ marginTop: "20px" }}>
            <AudioUploader onLoad={handleAudioUpload} />
        </div>
        
        <div id="waveform" ref={waveformRef} style={{ marginTop: "20px", background: "#0c0f1a", borderRadius: "8px", padding: "10px" }}></div>
        
        {audioFile && (
            <button onClick={analizar} style={{ marginTop: "15px", width: "100%", fontSize: "16px", letterSpacing: "2px" }}>
                ANALIZAR MEZCLA & ORIGINALIDAD
            </button>
        )}

        {analisis && (
          <div className="panel" style={{ marginTop: "15px", padding: "15px", fontSize: "14px", display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
                <div style={{ color: "#ffcc00", fontSize: "10px", letterSpacing: "1px" }}>DURACIÓN</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>{analisis.duration.toFixed(2)}s</div>
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{ color: "#ffcc00", fontSize: "10px", letterSpacing: "1px" }}>SAMPLE RATE</div>
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>{analisis.sampleRate} Hz</div>
            </div>
            <div style={{ textAlign: "center" }}>
                <div style={{ color: "#ffcc00", fontSize: "10px", letterSpacing: "1px" }}>CALIDAD</div>
                <div style={{ fontSize: "18px", fontWeight: "bold", color: analisis.sampleRate >= 44100 ? '#00ffc3' : '#ff4444' }}>
                    {analisis.sampleRate >= 44100 ? 'ALTA' : 'BAJA'}
                </div>
            </div>
            
            {clipping !== null && (
                <div style={{ 
                    padding: "10px 20px", 
                    borderRadius: "8px", 
                    fontWeight: "bold",
                    background: clipping ? "rgba(255, 68, 68, 0.2)" : "rgba(0, 255, 166, 0.2)",
                    color: clipping ? "#ff4444" : "#00ffa6",
                    border: `1px solid ${clipping ? "#ff4444" : "#00ffa6"}`
                }}>
                    {clipping ? "⚠ Clipping detectado" : "✓ Audio limpio"}
                </div>
            )}

            {originalidad && (
                <div style={{ 
                    padding: "10px 20px", 
                    borderRadius: "8px", 
                    fontWeight: "bold",
                    background: originalidad.originalidad > 90 ? "rgba(0, 255, 166, 0.2)" : "rgba(255, 165, 0, 0.2)",
                    color: originalidad.originalidad > 90 ? "#00ffa6" : "#ffa500",
                    border: `1px solid ${originalidad.originalidad > 90 ? "#00ffa6" : "#ffa500"}`
                }}>
                    Originalidad: {originalidad.originalidad}%
                    {originalidad.alertas.length > 0 && <span style={{display: "block", fontSize: "12px", marginTop: "5px"}}>{originalidad.alertas[0]}</span>}
                </div>
            )}
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
                    <button onClick={ejecutarMaster1} style={{ flex: 1 }}>
                        MASTER 1
                    </button>
                    <button onClick={ejecutarMaster2} style={{ flex: 1, borderColor: "#00ffc3", color: "#00ffc3", boxShadow: "0 0 10px rgba(0,255,195,0.5)" }}>
                        MASTER 2
                    </button>
                </div>
                
                {mensaje && (
                    <div style={{ marginTop: "15px", padding: "10px", background: "#111", border: "1px solid #ffcc00", borderRadius: "8px", color: "#ffcc00", textAlign: "center" }}>
                        Estado: {mensaje}
                    </div>
                )}

                {audioProcesado && (
                    <button onClick={escucharResultado} style={{ width: "100%", background: "#00ffc3", color: "#000", fontWeight: "bold", marginTop: "15px" }}>
                        ▶ ESCUCHAR RESULTADO
                    </button>
                )}

                <button onClick={handleExport} style={{ width: "100%", background: "#ffcc00", color: "#000", fontWeight: "bold", marginTop: "10px" }}>
                    ⬇ EXPORTAR FLAC MASTER
                </button>
            </div>
           </CollapsiblePanel>

           <CollapsiblePanel title="📝 LETRA & PROPIEDAD">
            <div style={{ marginTop: "10px", padding: "15px", background: "#0c0f1a", borderRadius: "10px" }}>
                <textarea 
                    id="lyricsInput"
                    placeholder="Pega aquí la letra de la canción"
                    value={letra}
                    onChange={(e) => setLetra(e.target.value)}
                    style={{
                        width: "100%",
                        height: "120px",
                        background: "#05070f",
                        color: "white",
                        border: "1px solid #333",
                        padding: "10px",
                        fontSize: "14px",
                        resize: "none",
                        fontFamily: "inherit",
                        marginBottom: "10px"
                    }}
                ></textarea>
                <button onClick={handleCrearObra} style={{ width: "100%", background: "#5a2cff", color: "white", fontWeight: "bold" }}>
                    FIJAR OBRA (HASH + TIMESTAMP)
                </button>

                {obraActual && (
                  <div style={{ marginTop: "15px", borderTop: "1px solid #333", paddingTop: "10px" }}>
                    <h4 style={{ color: "#ffcc00", margin: "0 0 10px 0" }}>Royalties Engine</h4>
                    {obraActual.owners.map((owner, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "5px" }}>
                        <span>{owner.author} ({owner.role})</span>
                        <span style={{ color: "#00ffa6" }}>{owner.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
            </div>
           </CollapsiblePanel>

           <CollapsiblePanel title="🛒 MARKETPLACE & LEGAL">
            <div style={{ fontSize: "14px" }}>
                {obraActual ? (
                  <>
                    <div style={{ padding: "10px", background: "#111", border: "1px solid #333", borderRadius: "8px", marginBottom: "15px" }}>
                      <h4 style={{ margin: "0 0 10px 0", color: "#00ffc3" }}>Obra: {obraActual.titulo}</h4>
                      <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#888" }}>ID: {obraActual.id.substring(0, 8)}...</p>
                      <p style={{ margin: "0 0 5px 0", fontSize: "12px", color: "#888" }}>Versión: {obraActual.versiones.length}</p>
                      
                      <button onClick={handleGenerarPaquete} style={{ width: "100%", background: "#ffcc00", color: "#000", fontWeight: "bold", marginTop: "10px" }}>
                        📦 DESCARGAR PAQUETE LEGAL
                      </button>
                    </div>

                    <h4 style={{ color: "#ffcc00", marginBottom: "10px" }}>Licencias Disponibles</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button style={{ background: "transparent", border: "1px solid #5a2cff", color: "#5a2cff" }}>Comprar Letra (No Exclusiva)</button>
                      <button style={{ background: "transparent", border: "1px solid #00ffa6", color: "#00ffa6" }}>Comprar Beat (Exclusiva)</button>
                      <button style={{ background: "transparent", border: "1px solid #ffcc00", color: "#ffcc00" }}>Comprar Full (100% Royalties)</button>
                    </div>
                  </>
                ) : (
                  <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>Fija una obra primero para ver las opciones de marketplace y legales.</p>
                )}
                
                <div style={{ marginTop: "20px", borderTop: `1px solid #2a2f45`, paddingTop: "15px" }}>
                    <h4 style={{ color: "#ffcc00", marginBottom: "10px" }}>Blindaje Blockchain (OTS) Externo</h4>
                    <input type="file" onChange={handleBlindaje} style={{ fontSize: "12px", width: "100%" }} />
                </div>
            </div>
           </CollapsiblePanel>

       </div>
   </div>

  </div>
 )
}
