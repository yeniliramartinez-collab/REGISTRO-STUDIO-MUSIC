import JSZip from "jszip"
import { saveAs } from "file-saver"

export const exportar = async (files: any) => {

 const zip = new JSZip()

 zip.file("metadata.json", files.meta)

 zip.file("legal.pdf", files.pdf)

 zip.file("audio.wav", files.wav)

 const blob = await zip.generateAsync({
  type: "blob"
 })

 saveAs(blob,"arkhe-export.zip")

}
