import { SystemRestore } from "../../core/restore/SystemRestore"

export default function RestoreButton(){

  const restaurar = () => {

    const estado = SystemRestore.restaurar()

    console.log("Restaurando sistema", estado)

  }

  return (

    <button
      style={{
        background:"#FFD700",
        padding:"10px",
        borderRadius:"8px",
        color: "#000",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer"
      }}
      onClick={restaurar}
    >
      Restaurar sistema
    </button>

  )

}
