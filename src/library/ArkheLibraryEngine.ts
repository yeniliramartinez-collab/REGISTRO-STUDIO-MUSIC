import { generarHash } from "../legal/hashEngine/HashEngine"

export type Role = "letra" | "musica" | "produccion" | "interprete";

export interface Ownership {
  author: string;
  percentage: number;
  role: Role;
}

export interface Version {
  versionId: string;
  versionNumber: number;
  hash: string;
  otsProof?: string;
  timestamp: number;
  letra: string;
  audio?: string;
  midi?: string;
  metadata: any;
}

export interface Obra {
  id: string;
  titulo: string;
  owners: Ownership[];
  versiones: Version[];
  estado: "borrador" | "analizada" | "masterizada" | "lista_registro" | "publicada";
  licenciasDisponibles: string[];
}

export class ArkheLibraryEngine {
  static dbKey = "ARKHE_LIBRARY_V2"

  static cargarBiblioteca(): Obra[] {
    const data = localStorage.getItem(this.dbKey)
    return data ? JSON.parse(data) : []
  }

  static guardarObra(obra: Obra) {
    const biblioteca = this.cargarBiblioteca()
    const index = biblioteca.findIndex(o => o.id === obra.id)
    if (index >= 0) {
      biblioteca[index] = obra
    } else {
      biblioteca.push(obra)
    }
    localStorage.setItem(this.dbKey, JSON.stringify(biblioteca))
    return obra
  }

  static crearNuevaObra(titulo: string, autorPrincipal: string, letra: string, audio: string): Obra {
    const versionId = crypto.randomUUID();
    const timestamp = Date.now();
    const metadata = { titulo, autorPrincipal };
    const hash = generarHash({ letra, audio, metadata });

    const versionInicial: Version = {
      versionId,
      versionNumber: 1,
      hash,
      timestamp,
      letra,
      audio,
      metadata
    };

    const obra: Obra = {
      id: crypto.randomUUID(),
      titulo,
      owners: [
        { author: autorPrincipal, percentage: 100, role: "letra" }
      ],
      versiones: [versionInicial],
      estado: "borrador",
      licenciasDisponibles: ["no exclusiva", "exclusiva", "porcentaje"]
    };

    return this.guardarObra(obra);
  }

  static agregarVersion(obraId: string, letra: string, audio: string, midi?: string, otsProof?: string): Obra | null {
    const biblioteca = this.cargarBiblioteca();
    const obra = biblioteca.find(o => o.id === obraId);
    if (!obra) return null;

    const metadata = { titulo: obra.titulo };
    const hash = generarHash({ letra, audio, midi, metadata });

    const ultimaVersion = obra.versiones[obra.versiones.length - 1];
    if (ultimaVersion && ultimaVersion.hash === hash) {
      if (otsProof && !ultimaVersion.otsProof) {
        ultimaVersion.otsProof = otsProof;
        return this.guardarObra(obra);
      }
      return obra;
    }

    const versionNumber = obra.versiones.length + 1;
    const versionId = crypto.randomUUID();
    const timestamp = Date.now();

    const nuevaVersion: Version = {
      versionId,
      versionNumber,
      hash,
      otsProof,
      timestamp,
      letra,
      audio,
      midi,
      metadata
    };

    obra.versiones.push(nuevaVersion);
    return this.guardarObra(obra);
  }

  static actualizarPropiedad(obraId: string, owners: Ownership[]): Obra | null {
    const biblioteca = this.cargarBiblioteca();
    const obra = biblioteca.find(o => o.id === obraId);
    if (!obra) return null;

    // Validar que sume 100%
    const total = owners.reduce((acc, o) => acc + o.percentage, 0);
    if (total !== 100) {
      throw new Error("Los porcentajes de propiedad deben sumar 100%");
    }

    obra.owners = owners;
    return this.guardarObra(obra);
  }

  static listar() {
    return this.cargarBiblioteca()
  }
}
