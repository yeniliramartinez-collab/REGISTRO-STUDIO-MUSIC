import { jsPDF } from 'jspdf';
import fs from 'fs';

export const ScoreGenerator = {
  generateLeadSheet(title: string, author: string, outputPath: string) {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text(title, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Composed by: ${author}`, 105, 30, { align: 'center' });
    doc.text('Lead Sheet', 105, 40, { align: 'center' });
    
    // Draw staff lines (simulated)
    for (let i = 0; i < 5; i++) {
        doc.line(20, 60 + (i * 2), 190, 60 + (i * 2));
    }
    
    // Add some notes (simulated)
    doc.text('G', 30, 55);
    doc.circle(32, 65, 1, 'F');
    doc.line(32, 65, 32, 55);

    fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
  },

  generatePianoScore(title: string, author: string, outputPath: string) {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text(title, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Composed by: ${author}`, 105, 30, { align: 'center' });
    doc.text('Piano Score', 105, 40, { align: 'center' });

    // Draw Grand Staff (simulated)
    // Treble Clef Staff
    for (let i = 0; i < 5; i++) {
        doc.line(20, 60 + (i * 2), 190, 60 + (i * 2));
    }
    // Bass Clef Staff
    for (let i = 0; i < 5; i++) {
        doc.line(20, 80 + (i * 2), 190, 80 + (i * 2));
    }
    
    // Brace
    doc.line(20, 60, 20, 90);

    fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
  }
};
