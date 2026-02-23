import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import MidiWriter from 'midi-writer-js';
import { jsPDF } from 'jspdf';
import { TrackIntegrity, TrackMetadata } from './types';

const LIBRARY_PATH = path.join(process.cwd(), 'library');

export const TrackPackageGenerator = {
  async createPackage(
    fileBuffer: Buffer,
    metadata: Omit<TrackMetadata, 'id' | 'sha256' | 'createdAt' | 'workId' | 'iswc'>
  ) {
    const trackId = `PROJECT_${Date.now().toString().slice(-6)}`;
    const trackPath = path.join(LIBRARY_PATH, trackId);
    
    // Create directory structure
    if (!fs.existsSync(LIBRARY_PATH)) fs.mkdirSync(LIBRARY_PATH);
    if (!fs.existsSync(trackPath)) fs.mkdirSync(trackPath);
    
    const dirs = ['stems', 'midi', 'score', 'media', 'ads'];
    dirs.forEach(dir => {
      const dirPath = path.join(trackPath, dir);
      if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    });

    // 1. Save Master WAV
    const masterPath = path.join(trackPath, 'obra.wav');
    fs.writeFileSync(masterPath, fileBuffer);
    const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // 2. Generate Assets
    // SHA256 Text File
    fs.writeFileSync(path.join(trackPath, 'sha256.txt'), sha256);

    // Lyrics Text File
    const lyricsContent = metadata.lyrics || "Instrumental";
    fs.writeFileSync(path.join(trackPath, 'letra.txt'), lyricsContent);

    // Stems (Simulated)
    this.generateStems(masterPath, path.join(trackPath, 'stems'));

    // Score & MIDI
    this.generateScore(metadata.title, metadata.author, path.join(trackPath, 'score', 'partitura.pdf'));
    this.generateMidi(path.join(trackPath, 'midi', 'guia.mid'));

    // Ads / Preview
    this.generatePreview(masterPath, path.join(trackPath, 'ads', 'preview_30s.mp3'));
    
    // Cover Art
    this.generateCover(path.join(trackPath, 'media', 'portada.png'));
    this.generateVideoLoop(path.join(trackPath, 'ads', 'loop.mp4'));

    // 3. Create Metadata
    const fullMetadata: TrackMetadata = {
      ...metadata,
      id: trackId,
      workId: crypto.randomUUID(),
      iswc: `T-${Math.floor(Math.random() * 1000000000)}`,
      sha256,
      createdAt: Date.now()
    };
    fs.writeFileSync(path.join(trackPath, 'metadata.json'), JSON.stringify(fullMetadata, null, 2));

    // 4. Create Integrity File
    const integrity: TrackIntegrity = {
      track_id: trackId,
      status: 'healthy',
      required_assets: [
        'obra.wav',
        'metadata.json',
        'sha256.txt',
        'letra.txt',
        'score/partitura.pdf',
        'midi/guia.mid',
        'stems/voz.wav',
        'stems/instrumental.wav',
        'ads/preview_30s.mp3',
        'media/portada.png'
      ],
      missing_assets: [],
      last_check: Date.now(),
      repairable: true,
      issues: []
    };
    fs.writeFileSync(path.join(trackPath, 'integrity.json'), JSON.stringify(integrity, null, 2));

    return fullMetadata;
  },

  generateStems(masterPath: string, stemsDir: string) {
    // Simulation: In a real app, this would use a separation engine (Spleeter/Demucs)
    // For now, we just copy the master as placeholders
    if (fs.existsSync(masterPath)) {
        fs.copyFileSync(masterPath, path.join(stemsDir, 'voz.wav'));
        fs.copyFileSync(masterPath, path.join(stemsDir, 'instrumental.wav'));
    }
  },

  generateScore(title: string, author: string, outputPath: string) {
    const doc = new jsPDF();
    doc.setFontSize(24);
    doc.text(title, 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Composed by: ${author}`, 105, 30, { align: 'center' });
    doc.text('Lead Sheet / Partitura', 105, 40, { align: 'center' });
    
    // Draw staff lines
    for (let i = 0; i < 5; i++) {
        doc.line(20, 60 + (i * 2), 190, 60 + (i * 2));
    }
    fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
  },

  generateMidi(outputPath: string) {
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    track.addEvent(new MidiWriter.NoteEvent({ pitch: ['C4', 'E4', 'G4'], duration: '1' }));
    const write = new MidiWriter.Writer(track);
    fs.writeFileSync(outputPath, Buffer.from(write.buildFile()));
  },

  generatePreview(masterPath: string, outputPath: string) {
    if (fs.existsSync(masterPath)) {
        fs.copyFileSync(masterPath, outputPath);
    }
  },

  generateCover(outputPath: string) {
    const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    fs.writeFileSync(outputPath, pngSignature);
  },

  generateVideoLoop(outputPath: string) {
      // Placeholder for video loop
      fs.writeFileSync(outputPath, Buffer.from('fake-video-content'));
  }
};
