import React from 'react';

export default function GalleryWall({ photos }: { photos: { data: string }[] }) {
  return (
    <div className="gallery-wall-container">
      <div className="gallery-wall">
        {photos.map((p, i) => (
          <div key={i} className="gallery-frame-wrapper">
            <div className="gallery-frame">
              <div className="gallery-mat">
                <img src={p.data} alt={`Art ${i + 1}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .gallery-wall-container {
          padding: 2rem;
          background-color: #5a6660;
          border-radius: 8px;
        }
        .gallery-wall {
          column-count: 1;
          column-gap: 2rem;
        }
        @media (min-width: 600px) {
          .gallery-wall {
            column-count: 2;
          }
        }
        @media (min-width: 900px) {
          .gallery-wall {
            column-count: 3;
          }
        }
        .gallery-frame-wrapper {
          break-inside: avoid;
          margin-bottom: 2rem;
        }
        .gallery-frame {
          background-color: #111; /* frame color */
          padding: 8px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3), 5px 5px 15px rgba(0,0,0,0.2) inset;
        }
        .gallery-mat {
          background-color: #faf9f5;
          padding: 15%;
          box-shadow: 0 0 5px rgba(0,0,0,0.2) inset;
        }
        .gallery-mat img {
          width: 100%;
          height: auto;
          display: block;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
