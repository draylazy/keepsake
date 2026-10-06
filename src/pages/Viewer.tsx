import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorageService } from '../services/storage';
import type { AlbumData, PhotoData } from '../services/storage';
import AlbumView from '../components/AlbumView';
import { Camera } from 'lucide-react';

export default function Viewer() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [albumData, setAlbumData] = useState<{ album: AlbumData, photos: PhotoData[] } | null>(null);

  useEffect(() => {
    async function loadAlbum() {
      if (!code) return;
      
      try {
        const storage = getStorageService();
        const data = await storage.getAlbum(code);
        setAlbumData(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message === 'Album not found' ? 'album not found' : 'Failed to load album');
      } finally {
        setLoading(false);
      }
    }
    
    loadAlbum();
  }, [code]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Loading album...</h2>
        <div className="skeleton-album"></div>
      </div>
    );
  }

  if (error || !albumData) {
    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>Oops!</h2>
        <p>{error === 'album not found' ? 'We could not find an album with this code.' : error}</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
          Go to Homepage
        </button>
      </div>
    );
  }

  const { album, photos } = albumData;

  return (
    <div className="viewer-page">
      <div className="viewer-header container">
        <h1>{album.title}</h1>
        {album.note && <p className="handwritten viewer-note">{album.note}</p>}
      </div>
      
      <div className="viewer-content container">
        <AlbumView style={album.style} photos={photos} />
      </div>
      
      <div className="viewer-footer container">
        <button className="btn-secondary" onClick={() => navigate('/')}>
          <Camera size={20} />
          Make your own album
        </button>
      </div>
      
      <style>{`
        .viewer-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .viewer-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 3rem;
        }
        .viewer-header h1 {
          font-size: 2.5rem;
        }
        .viewer-note {
          font-size: 1.8rem;
          max-width: 600px;
          margin: 1rem auto 0;
          color: var(--text-color);
          opacity: 0.9;
        }
        .viewer-content {
          flex: 1;
          width: 100%;
        }
        .viewer-footer {
          margin-top: 4rem;
          padding-bottom: 3rem;
          text-align: center;
        }
        .skeleton-album {
          width: 100%;
          max-width: 600px;
          height: 400px;
          background: linear-gradient(90deg, var(--card-bg) 25%, var(--line-color) 50%, var(--card-bg) 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          margin: 2rem auto;
          border-radius: 8px;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
