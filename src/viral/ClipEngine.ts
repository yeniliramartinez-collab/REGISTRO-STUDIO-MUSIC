export function generateClips(buffer:AudioBuffer){
  const clips = []
  const duration = buffer.duration

  for(let i=30;i<duration;i+=45){
    clips.push({
      start:i,
      end:i+15
    })
  }

  return clips
}
