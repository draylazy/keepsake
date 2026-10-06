import React from 'react';

export default function GalleryWall({ photos, isCapturing, customizations }: { photos: { data: string; label?: string }[], isCapturing?: boolean, customizations?: any }) {
  return (
    <div 
      className="gallery-wall-container"
      style={{
        '--custom-bg': customizations?.bgColor || '#5a6660',
        '--custom-frame': customizations?.frameColor || '#faf9f5',
        '--custom-font-color': customizations?.fontColor || '#333',
        '--custom-font-family': customizations?.fontFamily || "'Caveat', cursive",
      } as React.CSSProperties}
    >
      <div className="gallery-wall">
        {photos.map((p, i) => (
          <div key={i} className="gallery-frame-wrapper">
            <div className="gallery-frame">
              <div className="gallery-mat">
                <img src={p.data} alt={`Art ${i + 1}`} />
                {p.label && <div className="photo-label handwritten">{p.label}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .gallery-wall-container {
          padding: 2rem;
          background-color: var(--custom-bg);
          border-radius: 8px;
        }
        .gallery-wall {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
          justify-content: center;
          align-items: flex-start;
        }
        .gallery-frame-wrapper {
          width: 100%;
          margin-bottom: 1rem;
        }
        @media (min-width: 600px) {
          .gallery-frame-wrapper {
            width: calc(50% - 1rem);
          }
        }
        @media (min-width: 900px) {
          .gallery-frame-wrapper {
            width: calc(33.333% - 1.33rem);
          }
        }
        .gallery-frame {
          background-color: #111; /* frame color */
          padding: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3), 5px 5px 15px rgba(0,0,0,0.2) inset;
        }
        .gallery-mat {
          background-color: var(--custom-frame);
          padding: 15%;
          box-shadow: 0 0 5px rgba(0,0,0,0.2) inset;
        }
        .gallery-mat img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .photo-label {
          text-align: center;
          margin-top: 15px;
          font-size: 1.2rem;
          color: var(--custom-font-color);
          font-family: var(--custom-font-family) !important;
        }
      `}</style>
    </div>
  );
}
