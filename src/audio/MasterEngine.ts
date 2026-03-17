export function master(buffer:AudioBuffer){
  const data = buffer.getChannelData(0)
  let peak = 0

  for(let i=0;i<data.length;i++){
    const v = Math.abs(data[i])
    if(v > peak) peak = v
  }

  const gain = 0.9/peak

  for(let i=0;i<data.length;i++){
    data[i]*=gain
  }

  return buffer
}

export function limiter(buffer:AudioBuffer){
  const data = buffer.getChannelData(0)

  for(let i=0;i<data.length;i++){
    if(data[i] > 0.95) data[i] = 0.95
    if(data[i] < -0.95) data[i] = -0.95
  }

  return buffer
}
