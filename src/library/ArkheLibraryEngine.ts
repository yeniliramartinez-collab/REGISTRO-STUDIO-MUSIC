import { generarHash } from "../legal/hashEngine/HashEngine"

export interface Obra {
 id:string
 titulo:string
 autor:string
 letra:string
 audio?:string
 hash:string
 fecha:number
 estado:"analizada" | "masterizada" | "lista_registro"
}

export class ArkheLibraryEngine {
 static dbKey = "ARKHE_LIBRARY"

 static cargarBiblioteca():Obra[] {
  const data = localStorage.getItem(this.dbKey)
  return data ? JSON.parse(data) : []
 }

 static guardarObra(data:any){
  const biblioteca = this.cargarBiblioteca()
  const hash = generarHash(JSON.stringify(data))

  const obra:Obra = {
   id: crypto.randomUUID(),
   titulo: data.titulo,
   autor: data.autor,
   letra: data.letra,
   audio: data.audio,
   hash,
   fecha: Date.now(),
   estado: "analizada"
  }

  biblioteca.push(obra)

  localStorage.setItem(
   this.dbKey,
   JSON.stringify(biblioteca)
  )

  return obra
 }

 static listar(){
  return this.cargarBiblioteca()
 }
}
