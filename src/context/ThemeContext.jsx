import React, { useState, useEffect, useMemo } from 'react';
import { ThemeContext } from './themeContext';

const leerTema = () => {
  try {
    return localStorage.getItem('theme') || 'light';
  } catch {
    return 'light';
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(leerTema);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Sin almacenamiento disponible: el tema dura hasta recargar.
    }
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme((anterior) => (anterior === 'light' ? 'dark' : 'light')) }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
