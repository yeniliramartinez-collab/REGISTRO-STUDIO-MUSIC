export function limiter(buffer: Float32Array, threshold = 0.9){
 for(let i=0;i<buffer.length;i++){
  if(buffer[i] > threshold){
   buffer[i] = threshold
  }
  if(buffer[i] < -threshold){
   buffer[i] = -threshold
  }
 }
 return buffer
}
