import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorageService } from '../services/storage';
import type { AlbumData, PhotoData } from '../services/storage';
import AlbumView from '../components/AlbumView';
import { Camera, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function Viewer() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [albumData, setAlbumData] = useState<{ album: AlbumData, photos: PhotoData[] } | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleDownload = async () => {
    const el = document.getElementById('album-capture-area');
    if (!el) return;
    
    setDownloading(true);
    // Wait for React to re-render the DOM with isCapturing=true and max-content
    await new Promise(resolve => setTimeout(resolve, 150));

    try {
      const isStorybook = albumData?.album.style === 'storybook';
      let targetWidth = el.scrollWidth;
      let targetHeight = el.scrollHeight;

      if (!isStorybook) {
        const size = Math.max(targetWidth, targetHeight);
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        
        // Wait a tick for browser to apply new size
        await new Promise(resolve => setTimeout(resolve, 50));
        targetWidth = size;
        targetHeight = size;
      }

      const canvas = await html2canvas(el, { 
        useCORS: true, 
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        scale: 2, // High quality
        windowWidth: targetWidth,
        windowHeight: targetHeight,
        width: targetWidth,
        height: targetHeight
      });
      const img = canvas.toDataURL('image/png');
      
      const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      let shared = false;
      
      if (isMobile) {
        try {
          // Attempt to use Web Share API only on mobile devices
          const response = await fetch(img);
          const blob = await response.blob();
          const file = new File([blob], `${albumData?.album.title || 'Keepsake-Album'}.png`, { type: 'image/png' });
          
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: albumData?.album.title || 'Keepsake Album',
            });
            shared = true;
          }
        } catch (err) {
          console.warn('Web Share API failed', err);
        }
      }

      if (!shared) {
        if (isMobile) {
          // Standard download link often fails silently on mobile browsers
          setGeneratedImage(img);
        } else {
          // Standard download for desktop/laptop
          const link = document.createElement('a');
          link.href = img;
          link.download = `${albumData?.album.title || 'Keepsake-Album'}.png`;
          link.click();
        }
      }
    } catch (e) {
      console.error("Failed to capture album", e);
    } finally {
      if (el) {
        el.style.display = '';
        el.style.flexDirection = '';
        el.style.justifyContent = '';
        el.style.alignItems = '';
        el.style.height = '';
      }
      setDownloading(false);
    }
  };

  useEffect(() => {
    async function loadAlbum() {
      if (!code) return;
      
      try {
        const storage = getStorageService();
        const data = await storage.getAlbum(code);
        setAlbumData(data);
      } catch (err: any) {
        console.error(err);
        if (err.message === 'Link Expired' || err.message?.includes('Missing or insufficient permissions') || err.code === 'permission-denied') {
          setError('Link Expired');
        } else {
          setError(err.message === 'Album not found' ? 'album not found' : 'Failed to load album');
        }
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
    let errorTitle = 'Oops!';
    let errorMessage = error === 'album not found' ? 'We could not find an album with this code.' : error;
    
    if (error === 'Link Expired') {
       errorTitle = 'Link Expired';
       errorMessage = 'This album link has expired. For privacy, links are only valid for 24 hours after creation.';
    }

    return (
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
        <h2>{errorTitle}</h2>
        <p>{errorMessage}</p>
        <button className="btn-primary" onClick={() => navigate('/')} style={{ marginTop: '2rem' }}>
          Go to Homepage
        </button>
      </div>
    );
  }

  const { album, photos } = albumData;
  const hoursLeft = Math.max(0, Math.floor((album.createdAt + 86400000 - Date.now()) / 3600000));

  return (
    <div className="viewer-page">
      {!downloading && (
        <div className="expiration-banner">
          This link expires in {hoursLeft} {hoursLeft === 1 ? 'hour' : 'hours'}.
        </div>
      )}
      <div 
        id="album-capture-area" 
        style={downloading ? { 
          padding: '40px', 
          background: 'var(--bg-color)', 
          width: 'max-content',
          minHeight: 'max-content',
          margin: '0 auto',
          boxSizing: 'border-box'
        } : { 
          padding: '20px 0', 
          background: 'var(--bg-color)', 
          width: '100%',
          minWidth: '100%'
        }}
      >
        <div className={`viewer-header ${downloading ? '' : 'container'}`}>
          <h1>{album.title}</h1>
          {album.note && <p className="handwritten viewer-note">{album.note}</p>}
        </div>
        
        <div className={`viewer-content ${downloading ? '' : 'container'}`} style={downloading ? { flex: 'none', width: '100%' } : {}}>
          <AlbumView style={album.style} photos={photos} isCapturing={downloading} customizations={album.customizations} />
        </div>
      </div>
      
      <div className="viewer-footer container">
        <div className="action-buttons">
          <button className="btn-primary" onClick={handleDownload} disabled={downloading}>
            <Download size={20} />
            {downloading ? 'Saving Image...' : 'Download Album'}
          </button>
          
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <Camera size={20} />
            Make your own
          </button>
        </div>
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
          margin-top: 2rem;
          padding-bottom: 3rem;
          display: flex;
          justify-content: center;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
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
        .expiration-banner {
          background-color: var(--accent-gold);
          color: #fff;
          text-align: center;
          padding: 0.5rem;
          font-weight: bold;
          font-size: 0.9rem;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
      
      {generatedImage && (
        <div className="modal-overlay" onClick={() => setGeneratedImage(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '2rem'
        }}>
          <p style={{ color: 'white', marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center' }}>
            Long-press the image to save it to your photos!
          </p>
          <img src={generatedImage} style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()} />
          <button className="btn-secondary" style={{ marginTop: '1.5rem', background: 'white' }} onClick={() => setGeneratedImage(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
