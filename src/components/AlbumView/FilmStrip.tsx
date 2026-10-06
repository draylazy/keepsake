import React from 'react';

export default function FilmStrip({ photos }: { photos: { data: string }[] }) {
  return (
    <div className="filmstrip-wrapper">
      <div className="filmstrip">
        <div className="sprockets top"></div>
        <div className="film-content">
          {photos.map((p, i) => (
            <div key={i} className="film-frame">
              <img src={p.data} alt={`Frame ${i + 1}`} />
            </div>
          ))}
        </div>
        <div className="sprockets bottom"></div>
      </div>
      
      <style>{`
        .filmstrip-wrapper {
          width: 100%;
          overflow-x: auto;
          padding: 2rem 0;
          background-color: #111;
          border-radius: 4px;
        }
        .filmstrip {
          display: inline-block;
          background-color: #000;
          padding: 20px 0;
          min-width: 100%;
        }
        .sprockets {
          height: 15px;
          background-image: radial-gradient(circle at 10px 7.5px, #fff 5px, transparent 5px);
          background-size: 20px 15px;
          background-repeat: repeat-x;
        }
        .sprockets.top {
          margin-bottom: 15px;
        }
        .sprockets.bottom {
          margin-top: 15px;
        }
        .film-content {
          display: flex;
          gap: 15px;
          padding: 0 15px;
        }
        .film-frame {
          height: 250px;
          background: #222;
          border: 2px solid #333;
        }
        .film-frame img {
          height: 100%;
          width: auto;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </div>
  );
}
