import { localDB, StoredWork } from "../storage/localDB";

export const workRegistry = {

  registerWork(title: string, author: string, metadata?: any): StoredWork {

    const id = this.generateSHA(title + author + Date.now());

    const work: StoredWork = {
      id,
      title,
      author,
      createdAt: Date.now(),
      metadata
    };

    localDB.saveWork(work);
    return work;
  },

  listWorks(): StoredWork[] {
    return localDB.getAllWorks();
  },

  generateSHA(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const chr = input.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return "ARKHE-" + Math.abs(hash).toString(16);
  }
};
