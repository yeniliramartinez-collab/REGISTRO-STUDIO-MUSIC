import CryptoJS from "crypto-js";

export function generarHash(data:string){

 return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);

}
