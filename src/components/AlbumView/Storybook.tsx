import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Storybook({ photos, isCapturing, customizations }: { photos: { data: string; label?: string }[], isCapturing?: boolean, customizations?: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex(prev => (prev + 1) % photos.length);
  const prev = () => setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);

  if (photos.length === 0) return null;

  if (isCapturing) {
    return (
      <div 
        className="storybook-capture-grid" 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: `${Math.ceil(Math.sqrt(photos.length)) * 550}px`,
          margin: '0 auto',
          gap: '2rem',
          '--custom-bg': customizations?.bgColor || '#fcf9f2',
          '--custom-frame': customizations?.frameColor || '#fff',
          '--custom-font-color': customizations?.fontColor || '#333',
          '--custom-font-family': customizations?.fontFamily || "'Caveat', cursive",
        } as React.CSSProperties}
      >
        {photos.map((p, index) => (
          <div className="storybook-frame" key={index}>
            <div className="storybook-photo-wrapper">
              <div className="storybook-img" style={{ backgroundImage: `url(${p.data})` }} />
            </div>
            {p.label && <div className="photo-label handwritten">{p.label}</div>}
            <div className="storybook-controls" style={{ justifyContent: 'center' }}>
              <span className="storybook-counter handwritten">
                {index + 1} of {photos.length}
              </span>
            </div>
          </div>
        ))}
        
        <style>{`
        .storybook-container {
          display: flex;
          justify-content: center;
          padding: 1rem 0;
        }
        .storybook-frame {
          background-color: var(--custom-bg);
          border: 1px solid #e8e3d3;
          border-radius: 4px 12px 12px 4px;
          box-shadow: -10px 0 20px rgba(0,0,0,0.05) inset, 0 5px 15px rgba(0,0,0,0.1);
          padding: 2rem;
          max-width: 500px;
          width: 500px;
          position: relative;
          margin: 0;
        }
        .storybook-frame::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(0,0,0,0.1);
        }
        .storybook-photo-wrapper {
          width: 100%;
          height: 327px; /* Fallback for html2canvas since it ignores aspect-ratio */
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--custom-frame);
          border: 1px solid #eee;
          padding: 0.5rem;
          margin-bottom: 2rem;
        }
        .storybook-img {
          width: 100%;
          height: 100%;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .storybook-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #333;
        }
        .storybook-counter {
          font-size: 1.5rem;
          color: var(--custom-font-color);
          font-family: var(--custom-font-family) !important;
        }
        .photo-label {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: var(--custom-font-color);
          font-family: var(--custom-font-family) !important;
        }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      className="storybook-container"
      style={{
        '--custom-bg': customizations?.bgColor || '#fcf9f2',
        '--custom-frame': customizations?.frameColor || '#fff',
        '--custom-font-color': customizations?.fontColor || '#333',
        '--custom-font-family': customizations?.fontFamily || "'Caveat', cursive",
      } as React.CSSProperties}
    >
      <div className="storybook-frame">
        <div className="storybook-photo-wrapper">
          <div 
            key={currentIndex} 
            className="storybook-img fade-in"
            style={{ backgroundImage: `url(${photos[currentIndex].data})` }}
            aria-label={`Page ${currentIndex + 1}`}
          />
        </div>
        
        {photos[currentIndex].label && (
          <div className="photo-label handwritten fade-in">
            {photos[currentIndex].label}
          </div>
        )}
        
        <div className="storybook-controls">
          <button onClick={prev} aria-label="Previous page"><ArrowLeft /></button>
          <span className="storybook-counter handwritten">
            {currentIndex + 1} of {photos.length}
          </span>
          <button onClick={next} aria-label="Next page"><ArrowRight /></button>
        </div>
      </div>
      
      <style>{`
        .storybook-container {
          display: flex;
          justify-content: center;
          padding: 1rem 0;
        }
        .storybook-frame {
          background-color: var(--custom-bg);
          border: 1px solid #e8e3d3;
          border-radius: 4px 12px 12px 4px;
          box-shadow: -10px 0 20px rgba(0,0,0,0.05) inset, 0 5px 15px rgba(0,0,0,0.1);
          padding: 2rem;
          max-width: 500px;
          width: 100%;
          position: relative;
        }
        .storybook-frame::before {
          content: '';
          position: absolute;
          left: 10px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: rgba(0,0,0,0.1);
        }
        .storybook-photo-wrapper {
          width: 100%;
          height: 327px; /* Fallback for html2canvas since it ignores aspect-ratio */
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--custom-frame);
          border: 1px solid #eee;
          padding: 0.5rem;
          margin-bottom: 2rem;
        }
        .storybook-img {
          width: 100%;
          height: 100%;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .fade-in {
          animation: fade 0.4s ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-in {
            animation: none;
          }
        }
        @keyframes fade {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .storybook-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #333;
        }
        .storybook-controls button {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #555;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          transition: transform 0.2s;
        }
        .storybook-controls button:hover {
          transform: scale(1.1);
          color: var(--accent-gold);
        }
        .storybook-counter {
          font-size: 1.5rem;
          color: var(--custom-font-color);
          font-family: var(--custom-font-family) !important;
        }
        .photo-label {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 1.2rem;
          color: var(--custom-font-color);
          font-family: var(--custom-font-family) !important;
        }
      `}</style>
    </div>
  );
}
