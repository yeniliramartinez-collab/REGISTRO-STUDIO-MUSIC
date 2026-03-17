import { jsPDF } from "jspdf";
import JSZip from "jszip";
import { Obra, Version } from "../library/ArkheLibraryEngine";

export class LegalEngine {
  static async generarCertificadoPDF(obra: Obra, version: Version): Promise<Blob> {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("CERTIFICADO DE AUTORÍA ARKHÉ", 20, 20);

    doc.setFontSize(14);
    doc.text(`Obra: ${obra.titulo}`, 20, 40);
    doc.text(`ID de Obra: ${obra.id}`, 20, 50);
    doc.text(`Versión: ${version.versionNumber}`, 20, 60);
    doc.text(`Fecha de fijación: ${new Date(version.timestamp).toUTCString()}`, 20, 70);

    doc.setFontSize(16);
    doc.text("Titulares de Derechos:", 20, 90);
    doc.setFontSize(12);
    let y = 100;
    obra.owners.forEach(owner => {
      doc.text(`- ${owner.author}: ${owner.percentage}% (${owner.role})`, 20, y);
      y += 10;
    });

    doc.setFontSize(16);
    doc.text("Evidencia Criptográfica:", 20, y + 10);
    doc.setFontSize(10);
    doc.text(`Hash SHA-256:`, 20, y + 20);
    doc.text(version.hash, 20, y + 25);
    
    if (version.otsProof) {
      doc.text(`Prueba OTS (OpenTimestamps):`, 20, y + 35);
      doc.text(version.otsProof.substring(0, 100) + "...", 20, y + 40); // Truncated for display
    }

    doc.setFontSize(10);
    doc.text("Este documento certifica la fijación de la obra en la plataforma Arkhé.", 20, 280);

    return doc.output("blob");
  }

  static async generarLetraPDF(obra: Obra, version: Version): Promise<Blob> {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Letra: ${obra.titulo}`, 20, 20);
    
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(version.letra, 170);
    doc.text(lines, 20, 40);

    return doc.output("blob");
  }

  static async generarDeclaracionIAPDF(obra: Obra, version: Version): Promise<Blob> {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("DECLARACIÓN DE INTERVENCIÓN DE IA", 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Obra: ${obra.titulo}`, 20, 40);
    doc.text(`ID: ${obra.id}`, 20, 50);
    
    const declaracion = `Por la presente se declara que la obra musical titulada "${obra.titulo}" ha sido asistida por herramientas de Inteligencia Artificial bajo la plataforma ARKHÉ STUDIO.

Nivel de Intervención:
- Generación de Letra: Asistida / Estructurada por IA.
- Composición Musical (MIDI): Generada algorítmicamente.
- Procesamiento de Audio (Masterización): Automatizado mediante DSP y heurísticas.

Los titulares de los derechos listados en el certificado de autoría mantienen la propiedad intelectual sobre la obra resultante, habiendo dirigido, curado y fijado el resultado final.`;

    const lines = doc.splitTextToSize(declaracion, 170);
    doc.text(lines, 20, 70);

    return doc.output("blob");
  }

  static async empaquetarObraCompleta(obra: Obra, versionIndex: number = -1): Promise<Blob> {
    const zip = new JSZip();
    
    const version = versionIndex === -1 ? obra.versiones[obra.versiones.length - 1] : obra.versiones[versionIndex];
    if (!version) throw new Error("Versión no encontrada");

    // 1. certificado.pdf
    const certificadoBlob = await this.generarCertificadoPDF(obra, version);
    zip.file("certificado.pdf", certificadoBlob);

    // 2. letra.pdf
    const letraBlob = await this.generarLetraPDF(obra, version);
    zip.file("letra.pdf", letraBlob);

    // 3. declaracion_ia.pdf
    const declaracionBlob = await this.generarDeclaracionIAPDF(obra, version);
    zip.file("declaracion_ia.pdf", declaracionBlob);

    // 4. metadata.json
    const metadata = {
      id: obra.id,
      titulo: obra.titulo,
      owners: obra.owners,
      version: version.versionNumber,
      timestamp: version.timestamp,
      hash: version.hash,
      licencias: obra.licenciasDisponibles
    };
    zip.file("metadata.json", JSON.stringify(metadata, null, 2));

    // 5. demo.wav (if available)
    if (version.audio) {
      try {
        const response = await fetch(version.audio);
        const audioBlob = await response.blob();
        zip.file("demo.wav", audioBlob);
      } catch (e) {
        console.error("No se pudo empaquetar el audio", e);
      }
    }

    // 6. midi.mid (if available)
    if (version.midi) {
      try {
        const response = await fetch(version.midi);
        const midiBlob = await response.blob();
        zip.file("midi.mid", midiBlob);
      } catch (e) {
        console.error("No se pudo empaquetar el midi", e);
      }
    }

    return zip.generateAsync({ type: "blob" });
  }
}
