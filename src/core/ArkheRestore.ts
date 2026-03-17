export function restaurarSistema(){
 const clave = prompt("Clave Arquitecto")
 if(clave !== "ARKHE_ARCHITECT"){
  alert("Acceso denegado")
  return
 }
 const backup = localStorage.getItem("ARKHE_SYSTEM_BACKUP")
 if(!backup) {
  alert("No hay backup disponible")
  return
 }
 const data = JSON.parse(backup)
 Object.keys(data).forEach(k=>{
  localStorage.setItem(k,data[k])
 })
 alert("Sistema restaurado")
}
