import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CONFIGURACIÓN PARA GITHUB PAGES
export default defineConfig({
  plugins: [react()],
  base: '/Hotel-Refugio/',
});
