import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// CONFIGURACIÓN PARA GITHUB PAGES
export default defineConfig({
  plugins: [react()],
  base: '/Hotel-Refugio/',
  // Solo en desarrollo: reenvía /rest/v1 a la base local de supabase/local (PostgREST)
  server: {
    proxy: {
      '/rest/v1': {
        target: 'http://localhost:54321',
        rewrite: (ruta) => ruta.replace(/^\/rest\/v1/, ''),
      },
    },
  },
});
