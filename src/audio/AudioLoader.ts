export async function loadAudio(ctx:AudioContext,file:File){
  const data = await file.arrayBuffer()
  return await ctx.decodeAudioData(data)
}
