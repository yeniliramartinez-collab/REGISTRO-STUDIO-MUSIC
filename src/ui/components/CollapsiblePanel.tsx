import React, { useState } from "react"
import { arkheTheme } from "../../theme/arkheTheme"

export default function CollapsiblePanel({title, children}: {title: string, children: React.ReactNode}){
 const [open,setOpen] = useState(true)

 return(
  <div className="panel" style={{
   marginBottom:"10px",
   overflow: "hidden",
   padding: 0
  }}>
   <div
    onClick={()=>setOpen(!open)}
    style={{
     padding:"15px",
     cursor:"pointer",
     fontWeight:"bold",
     background: "transparent",
     borderBottom: open ? "1px solid #2a2f45" : "none",
     color: arkheTheme.plata,
     display: "flex",
     justifyContent: "space-between",
     alignItems: "center"
    }}
   >
    <span style={{ color: "#ffcc00" }}>{title}</span>
    <span style={{ color: "#ffcc00" }}>{open ? "▼" : "▶"}</span>
   </div>
   {open && (
    <div style={{padding:"20px", color: "white"}}>
     {children}
    </div>
   )}
  </div>
 )
}
