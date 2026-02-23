export function generarContrato(metadata: any, hash: string): string {
  const fecha = new Date().toLocaleDateString();

  const contrato = `
CONTRATO DE LICENCIA MUSICAL DIGITAL

Fecha: ${fecha}

OBRA: ${metadata.titulo || metadata.nombre}
AUTOR: ${metadata.autor || "Visionary Founder"}
DURACIÓN: ${metadata.duracion || "N/A"}
GÉNERO: ${metadata.genero || "N/A"}

HASH DE OBRA (SHA-256):
${hash}

-------------------------------------

I. TITULARIDAD

El autor declara ser titular legítimo de los derechos de la obra arriba descrita.

II. LICENCIA

Se concede licencia para:

✔ Streaming
✔ Publicidad digital
✔ Redes sociales
✔ Sincronización audiovisual
✔ Reproducción comercial
✔ Distribución global

III. MEDIOS AUTORIZADOS

Meta Platforms (Facebook / Instagram)  
TikTok  
YouTube  
Spotify  
Apple Music  
Amazon Music  

IV. PROTECCIÓN

La presente obra queda vinculada criptográficamente mediante su hash único.

V. EXPLOTACIÓN

El titular podrá:

✔ Vender
✔ Licenciar
✔ Sub-licenciar
✔ Monetizar

VI. FIRMA DIGITAL

___________________________
AUTOR

___________________________
ARKHÉ SYSTEMS

-------------------------------------
`;

  return contrato;
}
