import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type AlbumStyle = 'scrapbook' | 'storybook' | 'gallerywall' | 'albumbook';

interface Photo {
  id: string; // just an internal uuid or timestamp
  data: string; // base64 data URL
  label?: string; // optional label/note for the picture
}

export interface Customizations {
  frameColor: string;
  bgColor: string;
  fontColor: string;
  fontFamily: string;
}

interface AppContextType {
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  addPhotos: (newPhotos: Photo[]) => void;
  removePhoto: (id: string) => void;
  updatePhotoLabel: (id: string, label: string) => void;
  
  albumStyle: AlbumStyle;
  setAlbumStyle: (style: AlbumStyle) => void;
  
  title: string;
  setTitle: (title: string) => void;
  
  note: string;
  setNote: (note: string) => void;
  
  customizations: Customizations;
  setCustomizations: React.Dispatch<React.SetStateAction<Customizations>>;
  updateCustomization: (key: keyof Customizations, value: string) => void;
  
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albumStyle, setAlbumStyle] = useState<AlbumStyle>('scrapbook');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [customizations, setCustomizations] = useState<Customizations>({
    frameColor: '#ffffff',
    bgColor: '',
    fontColor: '#333333',
    fontFamily: "'Caveat', cursive"
  });

  const addPhotos = (newPhotos: Photo[]) => {
    setPhotos(prev => {
      const combined = [...prev, ...newPhotos];
      return combined.slice(0, 15); // max 15 photos
    });
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const updatePhotoLabel = (id: string, label: string) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, label } : p));
  };

  const updateCustomization = (key: keyof Customizations, value: string) => {
    setCustomizations(prev => ({ ...prev, [key]: value }));
  };

  const resetApp = React.useCallback(() => {
    setPhotos([]);
    setAlbumStyle('scrapbook');
    setTitle('');
    setNote('');
    setCustomizations({
      frameColor: '#ffffff',
      bgColor: '',
      fontColor: '#333333',
      fontFamily: "'Caveat', cursive"
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        photos, setPhotos, addPhotos, removePhoto, updatePhotoLabel,
        albumStyle, setAlbumStyle,
        title, setTitle,
        note, setNote,
        customizations, setCustomizations, updateCustomization,
        resetApp
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
