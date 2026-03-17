export class LyricAnalyzer {

 static analizar(letra:string){

  const palabras = letra.split(" ")

  const repetidas = palabras.filter(
    (item, index) => palabras.indexOf(item) !== index
  )

  return {
    totalPalabras: palabras.length,
    repetidas: repetidas,
    metrica: "estable"
  }

 }

}
