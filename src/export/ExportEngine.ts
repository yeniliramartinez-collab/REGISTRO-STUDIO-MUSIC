export function exportWav(buffer:AudioBuffer){
  const data = buffer.getChannelData(0)
  const blob = new Blob([data],{type:"audio/wav"})
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "arkhe_master.wav"
  a.click()
}
