import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    // Check local storage on mount
    const savedTheme = localStorage.getItem('keepsake-theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme !== 'system') {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, []);

  const toggleTheme = () => {
    let nextTheme: 'light' | 'dark' | 'system' = 'system';
    
    // Cycle logic: System -> Light -> Dark -> System
    if (theme === 'system') {
      nextTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark';
    } else if (theme === 'light') {
      nextTheme = 'dark';
    } else {
      nextTheme = 'system'; // Or loop back to light if preferred
    }

    setTheme(nextTheme);
    localStorage.setItem('keepsake-theme', nextTheme);
    
    if (nextTheme === 'system') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
      title={`Current theme: ${theme}`}
    >
      {theme === 'light' ? <Sun size={20} /> : theme === 'dark' ? <Moon size={20} /> : <div style={{position: 'relative'}}><Sun size={20} style={{clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0% 100%)', position: 'absolute', left: 0}}/><Moon size={20} style={{clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'}}/></div>}
      
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
