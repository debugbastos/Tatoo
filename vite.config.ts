import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' deixa o build funcionar em qualquer pasta (Vercel, subpasta ou servidor estático).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    target: 'es2020',
    // Fotos sempre como arquivo separado: o navegador baixa só as que aparecem (lazy loading).
    assetsInlineLimit: 0,
  },
});
