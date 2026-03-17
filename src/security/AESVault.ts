import CryptoJS from "crypto-js"

export const vaultSave = (data: string, key: string) => {

  const encrypted = CryptoJS.AES.encrypt(
    data,
    key
  ).toString()

  return encrypted

}

export const vaultLoad = (encrypted: string, key: string) => {

  const bytes = CryptoJS.AES.decrypt(
    encrypted,
    key
  )

  return bytes.toString(CryptoJS.enc.Utf8)

}
