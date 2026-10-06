import React from 'react';
import type { AlbumStyle } from '../../state/AppContext';
import Scrapbook from './Scrapbook';
import Storybook from './Storybook';
import FilmStrip from './FilmStrip';
import GalleryWall from './GalleryWall';
import AlbumBook from './AlbumBook';

interface AlbumViewProps {
  style: AlbumStyle;
  photos: { id?: string; index: number; data: string }[];
  isCapturing?: boolean;
}

export default function AlbumView({ style, photos, isCapturing = false }: AlbumViewProps) {
  switch (style) {
    case 'scrapbook':
      return <Scrapbook photos={photos} isCapturing={isCapturing} />;
    case 'storybook':
      return <Storybook photos={photos} isCapturing={isCapturing} />;
    case 'filmstrip':
      return <FilmStrip photos={photos} isCapturing={isCapturing} />;
    case 'gallerywall':
      return <GalleryWall photos={photos} isCapturing={isCapturing} />;
    case 'albumbook':
      return <AlbumBook photos={photos} isCapturing={isCapturing} />;
    default:
      return <Scrapbook photos={photos} isCapturing={isCapturing} />;
  }
}
