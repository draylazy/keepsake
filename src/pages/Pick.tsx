import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext';
import { resizeImage } from '../services/imageResize';
import Stepper from '../components/Stepper';
import { Camera, X, ArrowRight } from 'lucide-react';

export default function Pick() {
  const navigate = useNavigate();
  const { photos, addPhotos, removePhoto, updatePhotoLabel } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalProcessing, setTotalProcessing] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // limit max total
    const remainingSlots = 15 - photos.length;
    if (remainingSlots <= 0) return;
    
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    setIsProcessing(true);
    setTotalProcessing(filesToProcess.length);
    setProgress(0);
    
    const newPhotos = [];
    for (let i = 0; i < filesToProcess.length; i++) {
      setProgress(i + 1);
      try {
        const dataUrl = await resizeImage(filesToProcess[i]);
        newPhotos.push({ id: crypto.randomUUID(), data: dataUrl });
      } catch (err) {
        console.error('Failed to resize', err);
      }
    }
    
    addPhotos(newPhotos);
    setIsProcessing(false);
    
    // Clear input so same file can be picked again if removed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container">
      <Stepper currentStep={1} />
      
      <div className="header">
        <h2>Choose your photos</h2>
        <p>{photos.length} of 15 added</p>
      </div>

      <div className="photo-grid">
        {photos.map((p, index) => (
          <div key={p.id} className="photo-thumb-wrapper">
            <div className="photo-thumb">
              <img src={p.data} alt={`Photo ${index + 1}`} />
              <button className="remove-btn" onClick={() => removePhoto(p.id)} aria-label={`Remove photo ${index + 1}`}>
                <X size={16} />
              </button>
            </div>
            <input 
              type="text" 
              placeholder="Add note..." 
              className="photo-note-input"
              value={p.label || ''}
              onChange={(e) => updatePhotoLabel(p.id, e.target.value)}
            />
          </div>
        ))}
        
        {photos.length < 15 && (
          <div className="add-more" onClick={() => !isProcessing && fileInputRef.current?.click()}>
            <Camera size={24} />
            <span>Add more</span>
          </div>
        )}
      </div>
      
      {isProcessing && (
        <div className="processing-notice">
          Preparing photo {progress} of {totalProcessing}…
        </div>
      )}

      <div className="actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange}
        />
        <button 
          className="btn-primary" 
          disabled={photos.length === 0 || isProcessing}
          onClick={() => navigate('/style')}
        >
          Next: pick a style
          <ArrowRight size={20} />
        </button>
      </div>

      <style>{`
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .photo-thumb-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .photo-thumb {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          background: var(--card-bg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .photo-note-input {
          width: 100%;
          padding: 0.25rem 0.5rem;
          font-size: 0.85rem;
          border: 1px solid var(--line-color);
          border-radius: 4px;
          background: transparent;
        }
        .photo-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(0,0,0,0.5);
          color: white;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-btn:hover {
          background: rgba(0,0,0,0.8);
        }
        .add-more {
          aspect-ratio: 1;
          border-radius: 8px;
          border: 2px dashed var(--line-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          color: var(--line-color);
          transition: all 0.2s;
        }
        .add-more:hover {
          border-color: var(--text-color);
          color: var(--text-color);
        }
        .processing-notice {
          text-align: center;
          margin-top: 1rem;
          font-style: italic;
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
