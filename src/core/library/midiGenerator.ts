import MidiWriter from 'midi-writer-js';
import fs from 'fs';

export const MidiGenerator = {
  generateMelody(outputPath: string) {
    const track = new MidiWriter.Track();
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    
    // Add some notes (simulated melody)
    track.addEvent(new MidiWriter.NoteEvent({ pitch: ['C4'], duration: '4' }));
    track.addEvent(new MidiWriter.NoteEvent({ pitch: ['E4'], duration: '4' }));
    track.addEvent(new MidiWriter.NoteEvent({ pitch: ['G4'], duration: '4' }));
    track.addEvent(new MidiWriter.NoteEvent({ pitch: ['C5'], duration: '2' }));
    
    const write = new MidiWriter.Writer(track);
    fs.writeFileSync(outputPath, Buffer.from(write.buildFile()));
  }
};
