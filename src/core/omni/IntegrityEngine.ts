export function checkIntegrity(file: File) {
  if (file.size < 1024) {
    throw new Error("Archivo corrupto o incompleto");
  }
  return true;
}
