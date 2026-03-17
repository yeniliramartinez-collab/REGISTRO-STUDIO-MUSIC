import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

export const VaultService = {
  initDB: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('SovereignVault', 1);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('files')) {
          request.result.createObjectStore('files', { keyPath: 'id' });
        }
        if (!request.result.objectStoreNames.contains('checkpoints')) {
          request.result.createObjectStore('checkpoints', { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },
  
  saveFile: async (id: string, fileData: string, secret: string): Promise<void> => {
    const encrypted = AES.encrypt(fileData, secret).toString();
    const db = await VaultService.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').put({ id, data: encrypted });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  
  getFile: async (id: string, secret: string): Promise<string | null> => {
    const db = await VaultService.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('files', 'readonly');
      const request = tx.objectStore('files').get(id);
      request.onsuccess = () => {
        if (request.result) {
          try {
            const decrypted = AES.decrypt(request.result.data, secret).toString(encUtf8);
            resolve(decrypted);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  },
  
  checkpoint: async (state: any): Promise<void> => {
    const db = await VaultService.initDB();
    const data = JSON.stringify(state);
    return new Promise((resolve, reject) => {
      const tx = db.transaction('checkpoints', 'readwrite');
      tx.objectStore('checkpoints').add({ id: Date.now(), data });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};
