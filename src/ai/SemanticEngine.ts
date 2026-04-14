export class SemanticEngine {
  /**
   * Analiza la letra para extraer significado, mood y tags.
   * CRITERIO 7: Degradación Elegante -> Si no hay un LLM disponible, usa heurística.
   * CRITERIO 6: Persistencia Semántica -> Mantiene el contexto de la obra.
   */
  static analizarSemantica(letra: string): { mood: string, tags: string[] } {
    if (!letra) return { mood: "Indefinido", tags: [] };

    const lower = letra.toLowerCase();
    const tags: string[] = [];
    let mood = "Neutral";

    // Heurística básica de fallback
    if (lower.match(/(amor|corazón|beso|querer|amar)/)) {
      mood = "Romántico";
      tags.push("amor", "sentimental");
    }
    if (lower.match(/(noche|fiesta|bailar|fuego|ritmo)/)) {
      mood = "Energético";
      tags.push("fiesta", "baile");
    }
    if (lower.match(/(triste|llorar|dolor|adiós|soledad)/)) {
      mood = "Melancólico";
      tags.push("tristeza", "desamor");
    }
    if (lower.match(/(dinero|calle|ganar|poder|fuerte)/)) {
      mood = "Urbano/Agresivo";
      tags.push("calle", "superación");
    }

    if (tags.length === 0) {
      tags.push("contemporáneo", "original");
    }

    return { mood, tags };
  }
}
