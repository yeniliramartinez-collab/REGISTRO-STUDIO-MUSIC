import React, { useState } from "react";
import Header from "./components/Header";

export default function App() {

  const [view, setView] = useState<"catalogo" | "ingesta" | "legal">("catalogo");

  return (
    <div>

      <Header
        currentView={view}
        authorName="Héctor JT"
        onChangeView={setView}
      />

      <main style={{ padding: "30px" }}>

        {view === "catalogo" && (
          <div>
            <h2>Biblioteca de Obras</h2>
            <p>Aquí aparecerán tus canciones registradas.</p>
          </div>
        )}

        {view === "ingesta" && (
          <div>
            <h2>Crear Nueva Canción</h2>
            <p>Registrar letra, demo y metadata.</p>
          </div>
        )}

        {view === "legal" && (
          <div>
            <h2>Certificados Legales</h2>
            <p>Generar hash SHA256, timestamp y documentación.</p>
          </div>
        )}

      </main>

    </div>
  );
}
