import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type AlbumStyle = 'scrapbook' | 'storybook' | 'filmstrip' | 'gallerywall' | 'albumbook';

interface Photo {
  id: string; // just an internal uuid or timestamp
  data: string; // base64 data URL
}

interface AppContextType {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  addPhotos: (newPhotos: Photo[]) => void;
  removePhoto: (id: string) => void;
  
  albumStyle: AlbumStyle;
  setAlbumStyle: (style: AlbumStyle) => void;
  
  title: string;
  setTitle: (title: string) => void;
  
  note: string;
  setNote: (note: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albumStyle, setAlbumStyle] = useState<AlbumStyle>('scrapbook');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  const addPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => {
      const combined = [...prev, ...newPhotos];
      return combined.slice(0, 15); // max 15 photos
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        photos, setPhotos, addPhotos, removePhoto,
        albumStyle, setAlbumStyle,
        title, setTitle,
        note, setNote
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
