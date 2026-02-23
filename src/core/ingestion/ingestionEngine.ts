import { workRegistry } from "../registry/workRegistry";

export const ingestionEngine = {

  ingestWork(title: string, author: string) {
    if (!title || !author) {
      throw new Error("Datos incompletos");
    }

    const registered = workRegistry.registerWork(title, author);

    console.log("✅ Obra registrada:", registered);

    return registered;
  }

};
