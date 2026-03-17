import React from "react";
import { arkheTheme } from "../theme/arkheTheme";
import TranslatorButton from "./TranslatorButton";
import { restaurarSistema } from "../core/ArkheRestore";

export default function ArkheStatusBar({ loteActual }: { loteActual: number }) {
  return (
    <div style={{
      background: "#111",
      padding: "10px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: `1px solid ${arkheTheme.panelBorde}`,
      fontSize: "14px",
      color: arkheTheme.plata
    }}>
      <div style={{ fontWeight: "bold", color: arkheTheme.oro, letterSpacing: "2px" }}>ARKHÉ STUDIO</div>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <span>Sistema: <span style={{ color: "#00ffc3" }}>Estable</span></span>
        <span>Lote Registro: {loteActual} / 50</span>
        <TranslatorButton />
        <button 
          onClick={restaurarSistema}
          style={{
            background: arkheTheme.vino,
            color: arkheTheme.plata,
            border: "none",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "12px"
          }}
        >
          Restaurar
        </button>
      </div>
    </div>
  )
}
