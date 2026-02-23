import { hashFile } from "../tools/hashFile";
import { IntelligenceRegistry } from "../storage/intelligenceRegistry";
import crypto from "crypto";
import { File } from "buffer";

export async function ingest(file: File, title: string, author: string) {
  const sha256 = await hashFile(file);

  const record = {
    id: crypto.randomUUID(),
    title,
    author,
    sha256,
    size: file.size,
    mime: file.type,
    createdAt: Date.now()
  };

  IntelligenceRegistry.add(record);
  return record;
}
