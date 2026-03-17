export class SystemRestore {

 static checkpoints:any[] = []

 static guardar(estado:any){

  this.checkpoints.push(estado)

 }

 static restaurar(){

  return this.checkpoints[
   this.checkpoints.length - 1
  ]

 }

}
