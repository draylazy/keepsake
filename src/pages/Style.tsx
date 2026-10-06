import React, { useEffect } from 'react';
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
        <AlbumView style={albumStyle} photos={previewPhotos} customizations={customizations} />
      </div>

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
