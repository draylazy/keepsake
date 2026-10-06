import React from 'react';

export default function AlbumBook({ photos }: { photos: { data: string }[] }) {
  return (
    <div className="album-book-container">
      <div className="album-book">
        {photos.map((p, i) => (
          <div key={i} className="album-page">
            <div className="photo-corners">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
              <img src={p.data} alt={`Page ${i + 1}`} />
            </div>
            <div className="caption handwritten">Page {i + 1}</div>
          </div>
        ))}
      </div>
      
      <style>{`
        .album-book-container {
          background-color: #8c7355;
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
          background-color: #f4f0e6;
          width: calc(50% - 1px);
          min-width: 250px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
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
        .top-left { top: 0; left: 0; clip-path: polygon(0 0, 100% 0, 0 100%); }
        .top-right { top: 0; right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%); }
        .bottom-left { bottom: 0; left: 0; clip-path: polygon(0 0, 100% 100%, 0 100%); }
        .bottom-right { bottom: 0; right: 0; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
      `}</style>
    </div>
  );
}
