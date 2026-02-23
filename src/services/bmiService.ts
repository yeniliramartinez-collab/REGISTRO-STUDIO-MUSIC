export interface WorkData {
  titulo: string;
  autor: string;
  porcentaje_autor?: number;
  publisher?: string;
  publisher_share?: number;
  duracion: string;
  genero: string;
  idioma?: string;
  letra?: string;
  isrc?: string;
}

export interface BMIPackage {
  Work_Title: string;
  Composer: string;
  Composer_Share: number;
  Publisher: string;
  Publisher_Share: number;
  Duration: string;
  Genre: string;
  Language: string;
  Lyrics: string;
  ISRC: string;
  Timestamp: string;
  SHA256: string;
  Estado: string;
}

export const BMIService = {
  async generarPaqueteBMI(obra: WorkData): Promise<BMIPackage> {
    const encoder = new TextEncoder();
    const data = encoder.encode(JSON.stringify(obra));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const bmiPackage: BMIPackage = {
      Work_Title: obra.titulo,
      Composer: obra.autor,
      Composer_Share: obra.porcentaje_autor || 100,
      Publisher: obra.publisher || "Independiente",
      Publisher_Share: obra.publisher_share || 0,
      Duration: obra.duracion,
      Genre: obra.genero,
      Language: obra.idioma || "Instrumental",
      Lyrics: obra.letra || "N/A",
      ISRC: obra.isrc || "PENDIENTE",
      Timestamp: new Date().toISOString(),
      SHA256: sha256,
      Estado: "Listo para registro BMI"
    };

    console.log("🎼 Paquete BMI generado:", bmiPackage);
    return bmiPackage;
  }
};
