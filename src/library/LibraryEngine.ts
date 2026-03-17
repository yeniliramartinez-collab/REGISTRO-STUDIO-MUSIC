export function saveSong(name:string,url:string){
  const library = JSON.parse(localStorage.getItem("arkhe_library") || "[]")
  library.push({
    name,
    url,
    date:Date.now()
  })
  localStorage.setItem("arkhe_library",JSON.stringify(library))
}
