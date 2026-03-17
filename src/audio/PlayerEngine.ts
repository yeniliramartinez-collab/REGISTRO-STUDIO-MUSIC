import WaveSurfer from "wavesurfer.js"

export const initPlayer = (url: string) => {

 const ws = WaveSurfer.create({
  container:"#wave",
  waveColor:"#999",
  progressColor:"#00ffcc"
 })

 ws.load(url)

 return ws

}
