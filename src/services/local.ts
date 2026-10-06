import type { StorageService, AlbumData, PhotoData } from './storage';

const DB_NAME = 'KeepsakeDB';
const DB_VERSION = 1;

function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('albums')) {
        db.createObjectStore('albums', { keyPath: 'code' });
      }
      if (!db.objectStoreNames.contains('photos')) {
        const store = db.createObjectStore('photos', { keyPath: ['code', 'index'] });
        store.createIndex('code', 'code', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const localService: StorageService = {
  saveAlbum: async (code: string, album: AlbumData, photos: PhotoData[]) => {
    const db = await getDB();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(['albums', 'photos'], 'readwrite');
      
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      
      const albumsStore = tx.objectStore('albums');
      albumsStore.put({ code, ...album });
      
      const photosStore = tx.objectStore('photos');
      for (const p of photos) {
        photosStore.put({ code, index: p.index, data: p.data });
      }
    });
  },
  
  getAlbum: async (code: string) => {
    const db = await getDB();
    return new Promise<{ album: AlbumData, photos: PhotoData[] }>((resolve, reject) => {
      const tx = db.transaction(['albums', 'photos'], 'readonly');
      const albumsStore = tx.objectStore('albums');
      const photosStore = tx.objectStore('photos');
      
      const albumReq = albumsStore.get(code);
      const photoReq = photosStore.index('code').getAll(IDBKeyRange.only(code));
      
      tx.oncomplete = () => {
        if (!albumReq.result) {
          reject(new Error('Album not found'));
          return;
        }
        // sort photos by index
        const photos = (photoReq.result || []).sort((a: any, b: any) => a.index - b.index);
        
        resolve({
          album: albumReq.result as AlbumData,
          photos: photos.map((p: any) => ({ index: p.index, data: p.data }))
        });
      };
      tx.onerror = () => reject(tx.error);
    });
  }
};
