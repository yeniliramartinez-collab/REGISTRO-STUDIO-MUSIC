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
    if (!this.engine.buffer) {
      console.warn("No audio loaded to master");
      return;
    }
    masterBasico(this.engine.buffer.getChannelData(0))
  }

  play(){
    if (!this.engine.buffer) {
      console.warn("No audio loaded to play");
      return;
    }
    this.engine.play()
  }
}
