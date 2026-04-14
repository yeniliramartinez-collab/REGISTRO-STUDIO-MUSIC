import CryptoJS from "crypto-js";

export function generarHash(data: any): string {
  // Si es un string, lo hasheamos directo
  if (typeof data === 'string') {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }
  
  // Si es un objeto, ordenamos las llaves para determinismo
  const deterministicStringify = (obj: any): string => {
    if (obj === null) return 'null';
    if (typeof obj !== 'object') return JSON.stringify(obj);
    if (Array.isArray(obj)) {
      return '[' + obj.map(deterministicStringify).join(',') + ']';
    }
    const keys = Object.keys(obj).sort();
    const res = keys.map(k => JSON.stringify(k) + ':' + deterministicStringify(obj[k]));
    return '{' + res.join(',') + '}';
  };

  const stringified = deterministicStringify(data);
  return CryptoJS.SHA256(stringified).toString(CryptoJS.enc.Hex);
}

