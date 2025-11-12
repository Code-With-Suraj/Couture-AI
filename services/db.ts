const DB_NAME = 'RoopixAIDB';
const STORE_NAME = 'favorites';
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { autoIncrement: true });
        store.createIndex('imageUrl', 'imageUrl', { unique: true });
      }
    };
  });
};

export const getFavorites = async (): Promise<string[]> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = (request.result || []).map(item => item.imageUrl);
      resolve(result);
    };
  });
};

export const addFavorite = async (imageUrl: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({ imageUrl });

    request.onerror = () => {
        // Ignore constraint errors for duplicate entries
        if (request.error?.name !== 'ConstraintError') {
            reject(request.error);
        } else {
            resolve();
        }
    };
    request.onsuccess = () => resolve();
  });
};

export const removeFavorite = async (imageUrl: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('imageUrl');
    const request = index.getKey(imageUrl);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      if (request.result) {
        const deleteRequest = store.delete(request.result);
        deleteRequest.onerror = () => reject(deleteRequest.error);
        deleteRequest.onsuccess = () => resolve();
      } else {
        // Image not found, which is fine for a delete operation
        resolve(); 
      }
    };
  });
};