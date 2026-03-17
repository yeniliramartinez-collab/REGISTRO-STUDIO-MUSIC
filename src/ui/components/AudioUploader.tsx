import React from "react"

export default function AudioUploader({ onLoad }: { onLoad: (file: File) => void }) {
 return (
  <div className="panel" style={{
   border: `2px dashed #ffcc00`,
   padding: "20px",
   textAlign: "center",
   cursor: "pointer",
   transition: "all 0.3s ease"
  }}>
   <p style={{ color: "white", marginBottom: "10px" }}>Arrastra tu obra aquí o haz clic para explorar</p>
   <input
    type="file"
    accept="audio/*"
    onChange={e => {
     const file = e.target.files?.[0]
     if (!file) return
     onLoad(file)
    }}
    style={{ width: "100%", color: "#ffcc00" }}
   />
  </div>
 )
}
