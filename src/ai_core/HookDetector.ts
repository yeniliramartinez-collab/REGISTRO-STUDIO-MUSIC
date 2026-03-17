export async function detectarHook(file: File){
 const url = URL.createObjectURL(file)
 const audio = new Audio(url)
 
 return new Promise((resolve) => {
   audio.onloadedmetadata = () => {
     const duracion = audio.duration || 180
     const inicioHook = duracion * 0.35
     const finHook = inicioHook + 20
     URL.revokeObjectURL(url)
     resolve({
      detectado: true,
      inicio: inicioHook,
      fin: finHook
     })
   }
   
   // Fallback in case metadata doesn't load quickly
   setTimeout(() => {
     resolve({
      detectado: true,
      inicio: 60,
      fin: 80
     })
   }, 2000)
 })
}
