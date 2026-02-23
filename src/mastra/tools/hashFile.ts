import crypto from "crypto";
import { File } from "buffer";

export async function hashFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}
