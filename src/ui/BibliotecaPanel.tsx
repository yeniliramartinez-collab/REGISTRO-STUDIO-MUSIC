import React from "react";
import { arkheTheme } from "../theme/arkheTheme";
import { Obra } from "../library/ArkheLibraryEngine";

export default function BibliotecaPanel({ obras }: { obras: Obra[] }){
 return(
  <div style={{
   background: arkheTheme.panel,
   borderRadius: "10px",
   padding: "20px",
   border: `1px solid ${arkheTheme.panelBorde}`
  }}>
   <h3 style={{ color: arkheTheme.oro, marginTop: 0 }}>📚 Biblioteca</h3>
   
   <div style={{ maxHeight: "300px", overflowY: "auto", fontSize: "14px" }}>
    {obras.length === 0 ? (
        <p style={{ color: "#888" }}>No hay obras registradas</p>
    ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {obras.map(obra => (
                <li key={obra.id} style={{ padding: "10px", borderBottom: `1px solid ${arkheTheme.panelBorde}` }}>
                    <strong style={{ color: arkheTheme.plata }}>{obra.titulo}</strong>
                    <div style={{ fontSize: "12px", color: "#888" }}>{obra.estado}</div>
                </li>
            ))}
        </ul>
    )}
   </div>
  </div>
 )
}
