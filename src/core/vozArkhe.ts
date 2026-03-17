export function vozArkhe(texto:string){
 const voz = new SpeechSynthesisUtterance(texto)
 voz.lang = "es-MX"
 voz.rate = 0.95
 voz.pitch = 1
 window.speechSynthesis.cancel()
 window.speechSynthesis.speak(voz)
}
