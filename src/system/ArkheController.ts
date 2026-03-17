import {ArkheEngine} from "../core/ArkheEngine"
import {analyze} from "../audio/basicAudioAnalyzer"
import {masterBasico} from "../audio/masterEngine"

export class ArkheController{
  engine:ArkheEngine

  constructor(){
    this.engine = new ArkheEngine()
  }

  async load(file:File){
    await this.engine.load(file)
    return analyze(this.engine.buffer!)
  }

  master(){
    masterBasico(this.engine.buffer!.getChannelData(0))
  }

  play(){
    this.engine.play()
  }
}
