export class EvolutionEngine {

 static historial:any[] = []

 static registrar(evento:string){

  this.historial.push({
   evento,
   fecha:Date.now()
  })

 }

}
