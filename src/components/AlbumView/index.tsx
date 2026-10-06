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
}

export default function AlbumView({ style, photos }: AlbumViewProps) {
  switch (style) {
    case 'scrapbook':
      return <Scrapbook photos={photos} />;
    case 'storybook':
      return <Storybook photos={photos} />;
    case 'filmstrip':
      return <FilmStrip photos={photos} />;
    case 'gallerywall':
      return <GalleryWall photos={photos} />;
    case 'albumbook':
      return <AlbumBook photos={photos} />;
    default:
      return <Scrapbook photos={photos} />;
  }
}
