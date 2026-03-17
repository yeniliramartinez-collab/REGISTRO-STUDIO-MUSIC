export class LoteRegistro {

 static lote:any[] = []

 static agregar(obra:any){

  this.lote.push(obra)

 }

 static estado(){

  return this.lote.length + " / 50"

 }

}
