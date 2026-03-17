export function masterRapido(buffer:Float32Array){
 let max = 0
 for(let i=0;i<buffer.length;i++){
  if(Math.abs(buffer[i]) > max){
   max = Math.abs(buffer[i])
  }
 }
 const gain = 0.9/max
 for(let i=0;i<buffer.length;i++){
  buffer[i] *= gain
 }
 return buffer
}
