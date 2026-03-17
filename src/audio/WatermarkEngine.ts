export const watermarkAudio = (
 audioBuffer: ArrayBuffer,
 hash: string
) => {

 const marker = `ARKHE-${hash}`

 const view = new DataView(audioBuffer)

 for(let i=0;i<marker.length;i++){

  view.setUint8(
   i,
   marker.charCodeAt(i)
  )

 }

 return audioBuffer

}
