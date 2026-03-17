export interface Obra {

 id:string
 titulo:string
 autor:string
 letra:string
 hash:string
 fecha:number
 estado:string

}

export function guardarObra(obra:Obra){

 const data = localStorage.getItem("arkhe_library")

 const db = data ? JSON.parse(data) : []

 db.push(obra)

 localStorage.setItem(
  "arkhe_library",
  JSON.stringify(db)
 )

}
