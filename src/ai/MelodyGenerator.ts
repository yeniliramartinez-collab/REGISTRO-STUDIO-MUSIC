import MidiWriter from "midi-writer-js"

export const generarMidi = () => {

  const track = new MidiWriter.Track()

  track.addEvent(
    new MidiWriter.NoteEvent({
      pitch: ["C4","E4","G4"],
      duration: "4"
    })
  )

  const writer = new MidiWriter.Writer(track)

  return writer.dataUri()

}
