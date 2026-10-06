import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext';
import { resizeImage } from '../services/imageResize';
import { isFirebaseConfigured } from '../services/firestore';
import { Camera, ArrowRight } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addPhotos } = useAppContext();
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    const newPhotos = [];
    
    // Process files sequentially or in parallel?
    // Let's do sequentially to avoid freezing UI completely
    for (let i = 0; i < files.length; i++) {
      try {
        const dataUrl = await resizeImage(files[i]);
        newPhotos.push({ id: crypto.randomUUID(), data: dataUrl });
      } catch (err) {
        console.error('Failed to resize', err);
      }
    }
    
    addPhotos(newPhotos);
    setIsProcessing(false);
    navigate('/pick');
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      navigate(`/a/${code.trim()}`);
    }
  };

  return (
    <div className="container landing">
      {!isFirebaseConfigured && (
        <div style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '0.75rem', borderRadius: '8px', marginBottom: '2rem', textAlign: 'center' }}>
          Links only work on this browser until Firebase is connected.
        </div>
      )}
      
      <div className="hero">
        <div className="hero-text">
          <h1>Make a photo album and send it to someone you love.</h1>
          <p>No apps to download, no signups. Just your favorite photos, beautifully presented.</p>
          
          <div className="actions">
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
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Camera size={20} />
              {isProcessing ? 'Preparing photos...' : 'Choose photos'}
            </button>
            
            <form onSubmit={handleCodeSubmit} className="code-form">
              <input 
                type="text" 
                placeholder="Got a code?" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
              />
              <button type="submit" className="btn-secondary" aria-label="Go">
                <ArrowRight size={20} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="hero-images">
          <div className="tilted-card card-1">
            <div className="placeholder-img" style={{backgroundColor: '#cfcdc4'}}></div>
            <div className="caption handwritten">Together</div>
          </div>
          <div className="tilted-card card-2">
            <div className="placeholder-img" style={{backgroundColor: '#a3b1a8'}}></div>
            <div className="caption handwritten">Summer</div>
          </div>
          <div className="tilted-card card-3">
            <div className="placeholder-img" style={{backgroundColor: '#e3a63a', opacity: 0.8}}></div>
            <div className="caption handwritten">Add yours</div>
          </div>
        </div>
      </div>
      
      <style>{`
        .landing .hero {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          margin-top: 2rem;
        }
        @media (min-width: 768px) {
          .landing .hero {
            flex-direction: row;
            align-items: center;
          }
          .hero-text {
            flex: 1;
            padding-right: 2rem;
          }
          .hero-images {
            flex: 1;
          }
        }
        .hero h1 {
          font-size: 3rem;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .code-form {
          display: flex;
          gap: 0.5rem;
        }
        .hero-images {
          position: relative;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .tilted-card {
          position: absolute;
          background: var(--card-bg);
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 200px;
          transition: transform 0.3s;
        }
        .placeholder-img {
          width: 100%;
          height: 200px;
          border-radius: 2px;
          margin-bottom: 10px;
        }
        .tilted-card .caption {
          text-align: center;
          color: var(--text-color);
        }
        .card-1 {
          transform: rotate(-10deg) translateX(-40px) translateY(20px);
          z-index: 1;
        }
        .card-2 {
          transform: rotate(5deg) translateX(40px) translateY(-10px);
          z-index: 2;
        }
        .card-3 {
          transform: rotate(15deg) translateX(80px) translateY(40px);
          z-index: 3;
        }
        .hero-images:hover .tilted-card {
          transform: scale(1.05) rotate(0);
        }
      `}</style>
    </div>
  );
}
