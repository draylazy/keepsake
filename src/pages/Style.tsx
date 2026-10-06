import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext';
import type { AlbumStyle } from '../state/AppContext';
import Stepper from '../components/Stepper';
import AlbumView from '../components/AlbumView';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function StyleSelector() {
  const navigate = useNavigate();
  const { photos, albumStyle, setAlbumStyle } = useAppContext();

  useEffect(() => {
    if (photos.length === 0) {
      navigate('/pick');
    }
  }, [photos, navigate]);

  if (photos.length === 0) return null;

  const styles: { id: AlbumStyle; label: string }[] = [
    { id: 'scrapbook', label: 'Scrapbook' },
    { id: 'storybook', label: 'Storybook' },
    { id: 'gallerywall', label: 'Gallery wall' },
    { id: 'albumbook', label: 'Album book' },
  ];

  // We map the full object to match the expected format for AlbumView.
  // In the preview, we just need `data` and an index.
  const previewPhotos = photos.map((p, i) => ({ ...p, index: i }));

  return (
    <div className="container">
      <Stepper currentStep={2} />
      
      <div className="header">
        <h2>Choose a style</h2>
      </div>

      <div className="style-toggles" role="group" aria-label="Album styles">
        {styles.map(s => (
          <button
            key={s.id}
            className={`style-btn ${albumStyle === s.id ? 'active' : ''}`}
            aria-pressed={albumStyle === s.id}
            onClick={() => setAlbumStyle(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="preview-container">
        <AlbumView style={albumStyle} photos={previewPhotos} />
      </div>

      <div className="actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn-secondary" onClick={() => navigate('/pick')}>
          <ArrowLeft size={20} />
          Back
        </button>
        <button className="btn-primary" onClick={() => navigate('/share')}>
          Next: Add details
          <ArrowRight size={20} />
        </button>
      </div>

      <style>{`
        .style-toggles {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .style-btn {
          padding: 0.5rem 1rem;
          border: 2px solid var(--line-color);
          border-radius: 20px;
          background: transparent;
          color: var(--text-color);
          transition: all 0.2s;
        }
        .style-btn:hover {
          border-color: var(--accent-gold);
        }
        .style-btn.active {
          background: var(--btn-primary-bg);
          color: var(--btn-primary-text);
          border-color: var(--btn-primary-bg);
        }
        .preview-container {
          min-height: 400px;
          border-radius: 8px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
