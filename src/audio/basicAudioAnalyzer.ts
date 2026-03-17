export function analyze(buffer:AudioBuffer){
  const data = buffer.getChannelData(0)
  let peak = 0
  let sum = 0

  for(let i=0;i<data.length;i++){
    const v = Math.abs(data[i])
    if(v > peak) peak = v
    sum += v*v
  }

  const rms = Math.sqrt(sum/data.length)

  return {
    peak,
    rms,
    duration:buffer.duration
  }
}
