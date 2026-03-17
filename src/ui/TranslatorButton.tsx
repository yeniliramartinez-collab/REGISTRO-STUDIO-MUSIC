import React from "react";
import { arkheTheme } from "../theme/arkheTheme";

export default function TranslatorButton(){
 return(
  <button style={{
    background: "transparent",
    border: `1px solid ${arkheTheme.panelBorde}`,
    color: arkheTheme.plata,
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px"
  }}>
   🌐 Traducir
  </button>
 )
}
