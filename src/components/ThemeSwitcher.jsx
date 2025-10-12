import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className="btn btn-outline-secondary" 
      onClick={toggleTheme}
      aria-label="Cambiar tema"
    >
      {theme === 'light' ? <i className="fa-solid fa-moon"></i> : <i className="fa-solid fa-sun"></i>}
    </button>
  );
}
