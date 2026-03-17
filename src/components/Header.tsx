import React from "react";

interface HeaderProps {
  currentView: "catalogo" | "ingesta" | "legal";
  authorName: string;
  onChangeView: (view: "catalogo" | "ingesta" | "legal") => void;
}

export default function Header({ currentView, authorName, onChangeView }: HeaderProps) {

  const sections = {
    catalogo: {
      title: "Catálogo Maestro",
      description: "Biblioteca de canciones registradas"
    },
    ingesta: {
      title: "Ingesta Musical",
      description: "Crear y registrar nueva obra"
    },
    legal: {
      title: "Marco Jurídico",
      description: "Certificados y documentación legal"
    }
  };

  const { title, description } = sections[currentView] || { 
    title: "Vista Desconocida", 
    description: "Sección no encontrada" 
  };

  return (
    <header style={{
      width: "100%",
      background: "#111",
      color: "#fff",
      padding: "20px",
      borderBottom: "2px solid #333"
    }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>

        <div>
          <h1 style={{ margin: 0 }}>REGISTER STUDIO MUSIC PRO</h1>
          <p style={{ margin: 0, opacity: 0.7 }}>Autor: {authorName}</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => onChangeView("catalogo")}>
            Catálogo
          </button>

          <button onClick={() => onChangeView("ingesta")}>
            Nueva Obra
          </button>

          <button onClick={() => onChangeView("legal")}>
            Legal
          </button>
        </div>

      </div>

      <div style={{ marginTop: "15px" }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p style={{ margin: 0, opacity: 0.7 }}>{description}</p>
      </div>

    </header>
  );
}
