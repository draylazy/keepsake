import React from 'react';
import type { AlbumStyle } from '../../state/AppContext';
import Scrapbook from './Scrapbook';
import Storybook from './Storybook';
import GalleryWall from './GalleryWall';
import AlbumBook from './AlbumBook';

interface AlbumViewProps {
  style: AlbumStyle;
  photos: { id?: string; index: number; data: string; label?: string }[];
  isCapturing?: boolean;
  customizations?: any;
}

export default function AlbumView({ style, photos, isCapturing = false, customizations }: AlbumViewProps) {
  switch (style) {
    case 'scrapbook':
      return <Scrapbook photos={photos} isCapturing={isCapturing} customizations={customizations} />;
    case 'storybook':
      return <Storybook photos={photos} isCapturing={isCapturing} customizations={customizations} />;
    case 'gallerywall':
      return <GalleryWall photos={photos} isCapturing={isCapturing} customizations={customizations} />;
    case 'albumbook':
      return <AlbumBook photos={photos} isCapturing={isCapturing} customizations={customizations} />;
    default:
      return <Scrapbook photos={photos} isCapturing={isCapturing} customizations={customizations} />;
  }
}
