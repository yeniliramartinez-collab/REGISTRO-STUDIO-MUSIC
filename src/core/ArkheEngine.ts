export class ArkheEngine {

  ctx: AudioContext
  buffer: AudioBuffer | null = null
  masterBuffer: AudioBuffer | null = null

  constructor(){
    this.ctx = new AudioContext()
  }

  async load(file:File){
    const data = await file.arrayBuffer()
    this.buffer = await this.ctx.decodeAudioData(data)
    return this.buffer
  }

  play(buffer?:AudioBuffer){
    const src = this.ctx.createBufferSource()
    src.buffer = buffer || this.buffer
    src.connect(this.ctx.destination)
    src.start()
  }

}
