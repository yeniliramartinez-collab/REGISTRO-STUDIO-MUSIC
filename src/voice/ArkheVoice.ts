export function hablar(texto:string){
 const msg = new SpeechSynthesisUtterance(texto)
 msg.lang = "es-MX"
 msg.rate = 0.95
 msg.pitch = 1
 window.speechSynthesis.speak(msg)
}
