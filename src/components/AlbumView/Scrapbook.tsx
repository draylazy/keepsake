import React from 'react';

export default function Scrapbook({ photos, isCapturing }: { photos: { data: string }[], isCapturing?: boolean }) {
  return (
    <div className="scrapbook-container">
      {photos.map((p, i) => {
        const rotation = (i % 2 === 0 ? 1 : -1) * (2 + (i % 3) * 2);
        return (
          <div key={i} className="scrapbook-photo" style={{ transform: `rotate(${rotation}deg)` }}>
            <div className="tape"></div>
            <img src={p.data} alt={`Photo ${i + 1}`} />
          </div>
        );
      })}
      
      <style>{`
        .scrapbook-container {
          background-color: var(--line-color);
          padding: 2rem;
          border-radius: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          align-items: center;
        }
        .scrapbook-photo {
          background: #fff;
          padding: 10px;
          padding-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          position: relative;
          max-width: 250px;
          transition: transform 0.2s;
        }
        .scrapbook-photo:hover {
          transform: scale(1.05) rotate(0) !important;
          z-index: 10;
        }
        .scrapbook-photo img {
          width: 100%;
          height: auto;
          display: block;
        }
        .tape {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          width: 80px;
          height: 25px;
          background-color: rgba(255, 255, 255, 0.6);
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          z-index: 2;
        }
        @media (prefers-color-scheme: dark) {
          .scrapbook-photo {
            background: #fbfaf7; /* keep photos light in dark mode for polaroid feel */
          }
        }
      `}</style>
    </div>
  );
}
