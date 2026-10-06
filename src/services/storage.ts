import type { AlbumStyle } from '../state/AppContext';

export interface AlbumData {
  style: AlbumStyle;
  title: string;
  note: string;
  count: number;
  createdAt: number;
  customizations?: any;
}

export interface PhotoData {
  index: number;
  data: string; // base64
  label?: string;
}

export interface StorageService {
  saveAlbum: (code: string, album: AlbumData, photos: PhotoData[]) => Promise<void>;
  getAlbum: (code: string) => Promise<{ album: AlbumData, photos: PhotoData[] }>;
}

let activeService: StorageService | null = null;

export function getStorageService(): StorageService {
  if (!activeService) {
    throw new Error('Storage service not initialized');
  }
  return activeService;
}

export function setStorageService(service: StorageService) {
  activeService = service;
}
