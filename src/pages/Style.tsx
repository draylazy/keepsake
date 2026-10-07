import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext';
import type { AlbumStyle } from '../state/AppContext';
import Stepper from '../components/Stepper';
import AlbumView from '../components/AlbumView';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function StyleSelector() {
  const navigate = useNavigate();
  const { photos, albumStyle, setAlbumStyle, customizations, updateCustomization } = useAppContext();

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        // The downloaded image is always 1200px wide.
        // We scale it down to fit the current screen/container width if it's smaller.
        const parentWidth = containerRef.current.clientWidth || window.innerWidth;
        if (parentWidth < 1200) {
          setScale(parentWidth / 1200);
        } else {
          setScale(1);
        }
      }
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  return (
    <div className="style-page">
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
      </div>

      <div className="preview-container" ref={containerRef} style={{ width: '100%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <div style={{ zoom: scale, width: '1200px', transformOrigin: 'top center' }}>
          <AlbumView style={albumStyle} photos={previewPhotos} customizations={customizations} isCapturing={true} />
        </div>
      </div>

      <div className="container">
        <div className="customization-panel">
          <h3>Customize Appearance</h3>
          <div className="customization-grid">
            <div className="customization-item">
              <label>Frame Color</label>
              <input 
                type="color" 
                value={customizations.frameColor} 
                onChange={e => updateCustomization('frameColor', e.target.value)} 
              />
            </div>
            <div className="customization-item">
              <label>Background Color</label>
              <input 
                type="color" 
                value={customizations.bgColor || '#5a6660'} 
                onChange={e => updateCustomization('bgColor', e.target.value)} 
              />
            </div>
            <div className="customization-item">
              <label>Font Color</label>
              <input 
                type="color" 
                value={customizations.fontColor} 
                onChange={e => updateCustomization('fontColor', e.target.value)} 
              />
            </div>
            <div className="customization-item">
              <label>Font Family</label>
              <select 
                value={customizations.fontFamily} 
                onChange={e => updateCustomization('fontFamily', e.target.value)}
              >
                <option value="'Caveat', cursive">Handwritten (Caveat)</option>
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>
            
            {albumStyle === 'scrapbook' && (
              <div className="customization-item">
                <label>Tape Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input 
                    type="color" 
                    value={customizations.tapeColor || '#ffffff'} 
                    onChange={e => updateCustomization('tapeColor', e.target.value)} 
                    style={{ width: '40px', height: '40px', padding: '0', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                    Semi-transparent by default
                  </span>
                </div>
              </div>
            )}
            
            {albumStyle === 'gallerywall' && (
              <div className="customization-item" style={{ gridColumn: '1 / -1' }}>
                <label>Gallery Layout Template</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem', marginBottom: '1rem' }}>
                  {[
                    { id: 'scattered', label: 'Scattered' },
                    { id: 'dynamic', label: 'Dynamic Grid' },
                    { id: 'masonry', label: 'Masonry Columns' },
                    { id: 'classic', label: 'Classic Grid' }
                  ].map(layout => (
                    <button 
                      key={layout.id}
                      className={`btn-secondary ${customizations.galleryLayout === layout.id || (!customizations.galleryLayout && layout.id === 'scattered') ? 'active' : ''}`}
                      style={{ flex: 1, minWidth: '150px' }}
                      onClick={() => updateCustomization('galleryLayout', layout.id)}
                    >
                      {layout.label}
                    </button>
                  ))}
                </div>
                
                <label>Picture Placement</label>
                <div>
                  <button 
                    className="btn-secondary" 
                    onClick={() => updateCustomization('gallerySeed', Math.random())}
                  >
                    Shuffle Picture Positions
                  </button>
                </div>
              </div>
            )}
          </div>
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
      </div>

      <style>{`
        .style-page {
          min-height: 100vh;
        }
        .preview-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
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
          margin-bottom: 2rem;
        }
        .customization-panel {
          background: var(--card-bg);
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid var(--line-color);
        }
        .customization-panel h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          text-align: center;
        }
        .customization-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }
        .customization-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .customization-item label {
          font-size: 0.9rem;
          font-weight: bold;
        }
        .customization-item input[type="color"] {
          width: 50px;
          height: 50px;
          padding: 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .customization-item select {
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid var(--line-color);
          background: var(--bg-color);
          color: var(--text-color);
        }
      `}</style>
    </div>
  );
}
