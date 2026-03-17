import { sha256 } from "js-sha256";

export const blindaje = async (file: File) => {

  const buffer = await file.arrayBuffer()

  const hash = sha256(buffer)

  const response = await fetch(
    "https://ots.btc.cat/timestamp",
    {
      method: "POST",
      body: hash
    }
  )

  const otsProof = await response.text()

  return {
    hash,
    otsProof
  }

}
