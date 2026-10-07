import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check local storage on mount
    const savedTheme = localStorage.getItem('keepsake-theme') as 'light' | 'dark' | 'system' | null;
    
    // If no theme or it was set to system previously, default to light
    const initialTheme = (savedTheme === 'dark') ? 'dark' : 'light';
    
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    localStorage.setItem('keepsake-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('keepsake-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
      
      <style>{`
        .theme-toggle {
          position: fixed;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: var(--card-bg);
          border: 1px solid var(--line-color);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color);
          z-index: 1000;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }
        .theme-toggle:hover {
          transform: scale(1.1);
          background-color: var(--line-color);
        }
      `}</style>
    </button>
  );
}
