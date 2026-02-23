export function buildContract(track: any) {
  return {
    titulo: track.title,
    autor: track.author,
    fecha: new Date().toISOString(),
    licencia: "Uso Comercial Protegido",
    derechos: "Todos los derechos reservados"
  };
}
