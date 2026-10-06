import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, writeBatch, query, orderBy, where, deleteDoc } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import type { StorageService, AlbumData, PhotoData } from './storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

export const isFirebaseConfigured = !!firebaseConfig.apiKey;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export const firestoreService: StorageService = {
  saveAlbum: async (code: string, album: AlbumData, photos: PhotoData[]) => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured');
    
    // sign in anonymously
    await signInAnonymously(auth);
    
    const batch = writeBatch(db);
    
    const albumRef = doc(db, 'albums', code);
    batch.set(albumRef, album);
    
    photos.forEach(photo => {
      // document ID is just the index as string
      const photoRef = doc(db, 'albums', code, 'photos', photo.index.toString());
      batch.set(photoRef, { index: photo.index, data: photo.data, createdAt: album.createdAt });
    });
    
    await batch.commit();
  },
  
  getAlbum: async (code: string) => {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured');
    
    const albumRef = doc(db, 'albums', code);
    const albumSnap = await getDoc(albumRef);
    
    if (!albumSnap.exists()) {
      throw new Error('Album not found');
    }
    
    const album = albumSnap.data() as AlbumData;
    
    const photosRef = collection(db, 'albums', code, 'photos');
    const q = query(photosRef, orderBy('index'));
    const photosSnap = await getDocs(q);
    
    const photos: PhotoData[] = [];
    photosSnap.forEach(docSnap => {
      photos.push(docSnap.data() as PhotoData);
    });
    
    return { album, photos };
  }
};

export const cleanupExpiredAlbums = async () => {
  if (!isFirebaseConfigured || !auth.currentUser) return;
  try {
    const expiredTime = Date.now() - 86400000;
    const albumsRef = collection(db, 'albums');
    const q = query(albumsRef, where('createdAt', '<=', expiredTime));
    const snaps = await getDocs(q);
    
    for (const albumDoc of snaps.docs) {
      const code = albumDoc.id;
      const photosRef = collection(db, 'albums', code, 'photos');
      const pq = query(photosRef, where('createdAt', '<=', expiredTime));
      const pSnaps = await getDocs(pq);
      
      const batch = writeBatch(db);
      pSnaps.forEach(pDoc => batch.delete(pDoc.ref));
      batch.delete(albumDoc.ref);
      await batch.commit();
    }
  } catch (err) {
    console.error("Cleanup failed silently", err);
  }
};
