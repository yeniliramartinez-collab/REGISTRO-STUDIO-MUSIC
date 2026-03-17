export function normalizar(buffer: Float32Array){
 let max = 0
 for(let i=0;i<buffer.length;i++){
  if(Math.abs(buffer[i]) > max){
   max = Math.abs(buffer[i])
  }
 }
 const factor = 1/max
 for(let i=0;i<buffer.length;i++){
  buffer[i] *= factor
 }
 return buffer
}
