import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "registry.json");

export type Intelligence = {
  id: string;
  title: string;
  author: string;
  sha256: string;
  size: number;
  mime: string;
  createdAt: number;
};

let db: Intelligence[] = [];

if (fs.existsSync(DB_PATH)) {
  db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

export const IntelligenceRegistry = {
  add(intel: Intelligence) {
    db.push(intel);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  },

  list() {
    return db;
  },

  get(id: string) {
    return db.find(i => i.id === id);
  }
};
