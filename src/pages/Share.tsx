import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../state/AppContext';
import { getStorageService } from '../services/storage';
import Stepper from '../components/Stepper';
import { Copy, Share2, Eye, ArrowLeft } from 'lucide-react';

function generateCode() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'; // no look-alikes like i, l, 1, o, 0
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function Share() {
  const navigate = useNavigate();
  const { photos, albumStyle, title, setTitle, note, setNote } = useAppContext();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedCode, setSavedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (photos.length === 0) {
      navigate('/pick');
    }
  }, [photos, navigate]);

  if (photos.length === 0) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSaving(true);
    setError('');
    
    const code = generateCode();
    
    const albumData = {
      style: albumStyle,
      title: title.trim(),
      note: note.trim(),
      count: photos.length,
      createdAt: Date.now()
    };
    
    const photosData = photos.map((p, i) => ({
      index: i,
      data: p.data
    }));

    try {
      const storage = getStorageService();
      await storage.saveAlbum(code, albumData, photosData);
      setSavedCode(code);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save album. The images might be too large.');
    } finally {
      setIsSaving(false);
    }
  };

  const getLink = () => {
    return `${window.location.origin}/#/a/${savedCode}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // fallback
      const input = document.getElementById('link-input') as HTMLInputElement;
      if (input) {
        input.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Keepsake Photo Album',
          text: `I made a photo album for you: ${title}`,
          url: getLink(),
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    }
  };

  if (savedCode) {
    return (
      <div className="container">
        <div className="header">
          <h2>Album created!</h2>
          <p>Your photos are ready to be shared.</p>
        </div>
        
        <div className="share-success-box">
          <p style={{ marginBottom: '1rem' }}>Code: <strong>{savedCode}</strong></p>
          
          <div className="link-copy-wrapper">
            <input 
              id="link-input"
              type="text" 
              readOnly 
              value={getLink()} 
              className="link-input"
            />
            <button className="btn-primary" onClick={copyLink}>
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          
          <div className="share-actions">
            {typeof navigator.share === 'function' && (
              <button className="btn-secondary" onClick={shareLink}>
                <Share2 size={20} />
                Send...
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate(`/a/${savedCode}`)}>
              <Eye size={20} />
              Preview
            </button>
          </div>
        </div>
        
        <style>{`
          .share-success-box {
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 8px;
            border: 1px solid var(--line-color);
            text-align: center;
            max-width: 500px;
            margin: 0 auto;
          }
          .link-copy-wrapper {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
          }
          .link-input {
            flex: 1;
            background: rgba(0,0,0,0.05);
          }
          .share-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <Stepper currentStep={3} />
      
      <div className="header">
        <h2>Add details</h2>
      </div>

      <form onSubmit={handleSave} className="share-form">
        <div className="form-group">
          <label htmlFor="title">Album Title</label>
          <input 
            id="title"
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Our Summer Trip"
            maxLength={60}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="note">Note (optional, max 200 chars)</label>
          <textarea 
            id="note"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="A short message to accompany the album..."
            maxLength={200}
            rows={4}
          />
          <div className="char-count">{note.length} / 200</div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/style')} disabled={isSaving}>
            <ArrowLeft size={20} />
            Back
          </button>
          <button type="submit" className="btn-primary" disabled={isSaving || !title.trim()}>
            {isSaving ? 'Creating link...' : 'Create link'}
          </button>
        </div>
      </form>

      <style>{`
        .share-form {
          max-width: 500px;
          margin: 0 auto;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .char-count {
          text-align: right;
          font-size: 0.85rem;
          color: var(--line-color);
          margin-top: 0.25rem;
        }
        .error-message {
          color: #d32f2f;
          background: #ffebee;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
      `}</style>
    </div>
  );
}
