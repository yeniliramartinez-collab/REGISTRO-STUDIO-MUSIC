import { jsPDF } from "jspdf";

export function generarPDFColectivo(lote: any[]) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("EXPEDIENTE DE OBRA COLECTIVA", 20, 20);
  
  doc.setFontSize(10);
  doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 20, 30);
  doc.text(`Total de Obras: ${lote.length}`, 20, 35);

  let y = 50;
  const pageHeight = doc.internal.pageSize.height;

  lote.forEach((obra, i) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.text(`${i + 1}. ${obra.titulo}`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`   Autor: ${obra.autor}`, 20, y + 5);
    doc.text(`   Hash SHA-256: ${obra.hash}`, 20, y + 10);
    doc.text(`   Fecha: ${new Date(obra.fecha).toLocaleString()}`, 20, y + 15);
    
    y += 25;
  });

  doc.save("Expediente_Obra_Colectiva.pdf");
}
