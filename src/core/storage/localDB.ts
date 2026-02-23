export interface StoredWork {
  id: string;
  title: string;
  author: string;
  createdAt: number;
  metadata?: any;
}

const DB_KEY = 'arkhe_local_works';

export const localDB = {
  getAllWorks(): StoredWork[] {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  },

  saveWork(work: StoredWork) {
    const works = this.getAllWorks();
    works.push(work);
    localStorage.setItem(DB_KEY, JSON.stringify(works));
  },

  clear() {
    localStorage.removeItem(DB_KEY);
  }
};
