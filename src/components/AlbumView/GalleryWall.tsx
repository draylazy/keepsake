import React, { useMemo } from 'react';

export default function GalleryWall({ photos, isCapturing, customizations }: { photos: { data: string; label?: string }[], isCapturing?: boolean, customizations?: any }) {
  const layout = customizations?.galleryLayout || 'scattered';
  const seed = customizations?.gallerySeed || 0;

  const displayedPhotos = useMemo(() => {
    if (!seed) return photos;
    
    const shuffled = [...photos];
    let s = Math.floor(seed * 1000000);
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const rand = s / 233280;
      const j = Math.floor(rand * (i + 1));
      
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [photos, seed]);

  return (
    <div 
      className={`gallery-wall-container ${!isCapturing ? 'preview-mode' : ''}`}
      style={{
        '--custom-bg': customizations?.bgColor || '#5a6660',
        '--custom-frame': customizations?.frameColor || '#faf9f5',
        '--custom-font-color': customizations?.fontColor || '#333',
        '--custom-font-family': customizations?.fontFamily || "'Caveat', cursive",
      } as React.CSSProperties}
    >
      <div 
        className={`gallery-wall layout-${layout}`}
        style={isCapturing ? {
          maxWidth: '1500px',
          margin: '0 auto',
          padding: '2rem'
        } : {}}
      >
        {displayedPhotos.map((p, i) => (
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
        
        /* SCATTERED LAYOUT */
        .layout-scattered {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem;
          justify-content: center;
          align-items: center;
          padding: 2rem 0;
        }
        .layout-scattered .gallery-frame-wrapper {
          width: 250px;
          transition: transform 0.3s;
        }
        .layout-scattered .gallery-frame-wrapper:nth-child(2n) {
          width: 200px;
          transform: translateY(30px);
        }
        .layout-scattered .gallery-frame-wrapper:nth-child(3n) {
          width: 280px;
          transform: translateY(-20px);
        }
        .layout-scattered .gallery-frame-wrapper:nth-child(4n) {
          width: 220px;
          transform: translateY(15px);
        }
        .layout-scattered .gallery-frame-wrapper:nth-child(5n) {
          width: 260px;
          transform: translateY(-30px);
        }
        .layout-scattered .gallery-frame-wrapper:hover {
          z-index: 10;
        }

        /* DYNAMIC GRID LAYOUT */
        .layout-dynamic {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
          align-items: center;
        }
        @media (min-width: 768px) {
          .layout-dynamic {
            grid-template-columns: repeat(4, 1fr);
          }
          .layout-dynamic .gallery-frame-wrapper:nth-child(5n+1) {
            grid-column: span 2;
            grid-row: span 2;
          }
          .layout-dynamic .gallery-frame-wrapper:nth-child(5n+4) {
            grid-column: span 2;
          }
        }
        .layout-dynamic .gallery-frame-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
        }

        /* MASONRY LAYOUT */
        .layout-masonry {
          column-count: 1;
          column-gap: 2rem;
          padding: 2rem 0;
        }
        @media (min-width: 600px) { .layout-masonry { column-count: 2; } }
        @media (min-width: 900px) { .layout-masonry { column-count: 3; } }
        @media (min-width: 1200px) { .layout-masonry { column-count: 4; } }
        .layout-masonry .gallery-frame-wrapper {
          break-inside: avoid;
          margin-bottom: 2rem;
          width: 100%;
        }

        /* CLASSIC LAYOUT */
        .layout-classic {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 2rem 0;
        }
        .layout-classic .gallery-frame-wrapper {
          width: 100%;
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
        @media (max-width: 600px) {
          .gallery-wall-container.preview-mode .layout-scattered,
          .gallery-wall-container.preview-mode .layout-dynamic,
          .gallery-wall-container.preview-mode .layout-classic {
            grid-template-columns: 1fr !important;
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .gallery-wall-container.preview-mode .gallery-frame-wrapper {
            width: 90% !important;
            margin: 0 auto;
            transform: none !important; /* Remove rotation on mobile for better viewing */
            margin-bottom: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
