import { ArkheLibraryEngine } from "../library/ArkheLibraryEngine"

export class BatchRegisterEngine {
 static obtenerPendientes(){
  const obras = ArkheLibraryEngine.listar()
  return obras.filter(
   o => o.estado === "lista_registro"
  )
 }

 static estadoLote(){
  const pendientes = this.obtenerPendientes()
  return {
   actual: pendientes.length,
   maximo: 50
  }
 }

 static listoParaRegistro(){
  return this.obtenerPendientes().length >= 50
 }
}
