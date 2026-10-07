import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AlbumBook({ photos, isCapturing, customizations }: { photos: { data: string; label?: string }[], isCapturing?: boolean, customizations?: any }) {
  const [currentPage, setCurrentPage] = useState(0);
  const photosPerPage = 4;
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const displayedPhotos = isCapturing 
    ? photos 
    : photos.slice(currentPage * photosPerPage, (currentPage + 1) * photosPerPage);

  const next = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));
  const prev = () => setCurrentPage(p => Math.max(0, p - 1));

  return (
    <div className="album-book-wrapper">
      <div 
        className="album-book-container"
        style={{
          '--custom-bg': customizations?.bgColor || '#8c7355',
          '--custom-frame': customizations?.frameColor || '#f4f0e6',
          '--custom-font-color': customizations?.fontColor || '#333',
          '--custom-font-family': customizations?.fontFamily || "'Caveat', cursive",
        } as React.CSSProperties}
      >
        <div 
          className="album-book"
          style={isCapturing ? {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '1050px',
            margin: '0 auto',
            gap: '2px',
          } : {}}
        >
          {displayedPhotos.map((p, i) => {
            const actualIndex = isCapturing ? i : currentPage * photosPerPage + i;
            return (
              <div key={actualIndex} className="album-page" style={isCapturing ? { width: '250px', minWidth: '250px', margin: 0 } : {}}>
                <div className="photo-corners">
                  <div className="corner top-left"></div>
                  <div className="corner top-right"></div>
                  <div className="corner bottom-left"></div>
                  <div className="corner bottom-right"></div>
                  <img src={p.data} alt={`Page ${actualIndex + 1}`} />
                </div>
                <div className="caption handwritten">
                  {p.label ? p.label : `Page ${actualIndex + 1}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {!isCapturing && totalPages > 1 && (
        <div className="album-pagination">
          <button className="page-btn" onClick={prev} disabled={currentPage === 0} aria-label="Previous page">
            <ChevronLeft size={24} />
          </button>
          <span className="page-indicator">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button className="page-btn" onClick={next} disabled={currentPage === totalPages - 1} aria-label="Next page">
            <ChevronRight size={24} />
          </button>
        </div>
      )}
      
      <style>{`
        .album-book-container {
          background-color: var(--custom-bg);
          padding: 2rem;
          border-radius: 8px;
          display: flex;
          justify-content: center;
        }
        .album-book {
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
          max-width: 800px;
          background: #222;
          padding: 10px;
          border-radius: 4px;
        }
        .album-page {
          background-color: var(--custom-frame);
          width: calc(50% - 1px);
          min-width: 250px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid #e0dcd2;
        }
        .photo-corners {
          position: relative;
          padding: 10px;
          background: #fff;
          margin-bottom: 1rem;
        }
        .photo-corners img {
          display: block;
          max-width: 100%;
          height: auto;
        }
        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          background: #111;
          z-index: 2;
        }
        .caption {
          font-family: var(--custom-font-family) !important;
          color: var(--custom-font-color);
          text-align: center;
          margin-top: 1rem;
          font-size: 1.2rem;
        }
        .top-left { top: 0; left: 0; clip-path: polygon(0 0, 100% 0, 0 100%); }
        .top-right { top: 0; right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%); }
        .bottom-left { bottom: 0; left: 0; clip-path: polygon(0 0, 100% 100%, 0 100%); }
        .bottom-right { bottom: 0; right: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
        .album-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
          padding: 1rem;
        }
        .page-btn {
          background: var(--accent-gold);
          color: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .page-btn:hover:not(:disabled) {
          transform: scale(1.1);
          background: #d49842;
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: var(--line-color);
        }
        .page-indicator {
          font-weight: bold;
          color: var(--text-color);
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}
