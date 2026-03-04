import { AI_Disclosure, AuthorShare, LegalPack, Song } from '../types';

export class LegalFactory {
  static generateCertificate(song: Partial<Song>, hash: string): string {
    const timestamp = new Date().toISOString();
    return `
CERTIFICADO DE AUTORÍA Y FIJACIÓN LEGAL
---------------------------------------
ID CERTIFICADO: CERT-${hash.substring(0, 8).toUpperCase()}
TIMESTAMP: ${timestamp}
HASH SHA-256: ${hash}

OBRA: ${song.title}
AUTOR: ${song.author}
GÉNERO: ${song.genre}

DECLARACIÓN DE AUTORÍA:
El autor abajo firmante declara bajo protesta de decir verdad que es el creador original de la obra arriba descrita, la cual ha sido fijada en un medio tangible este día.

ESTADO LEGAL: PROTEGIDA (ARKHÉ SBPI)
`;
  }

  static generateAIDeclaration(disclosure: AI_Disclosure, hash: string): string {
    return `
DECLARACIÓN DE INTERVENCIÓN DE INTELIGENCIA ARTIFICIAL
------------------------------------------------------
VINCULACIÓN HASH: ${hash}

USO DE IA: ${disclosure.used ? 'SÍ' : 'NO'}
HERRAMIENTAS: ${disclosure.tools.join(', ')}
ELEMENTOS GENERADOS/ASISTIDOS: ${disclosure.elements.join(', ')}
PORCENTAJE DE INTERVENCIÓN: ${disclosure.percentage}%

NOTA LEGAL:
Esta declaración se emite para fines de transparencia ante oficinas de registro (INDAUTOR/IMPI) y distribuidores digitales.
`;
  }

  static generateDistributionJSON(song: Song): string {
    const data = {
      version: "1.0",
      provider: "ARKHÉ SYSTEMS",
      track: {
        title: song.title,
        artist: song.author,
        genre: song.genre,
        duration: song.duration,
        isrc: song.legal.isrc || "PENDING",
        upc: "PENDING",
        release_date: new Date(song.created).toISOString().split('T')[0],
      },
      legal: {
        sha256: song.legal.sha256,
        certificate: song.legal.certificateId,
        ai_disclosure: song.legal.aiDisclosure,
        shares: song.legal.shares
      }
    };
    return JSON.stringify(data, null, 2);
  }

  static buildLegalPack(
    hash: string, 
    author: string, 
    aiDisclosure: AI_Disclosure,
    shares: AuthorShare[]
  ): LegalPack {
    return {
      certificateId: `CERT-${hash.substring(0, 8).toUpperCase()}`,
      timestamp: Date.now(),
      sha256: hash,
      aiDisclosure,
      shares
    };
  }
}
