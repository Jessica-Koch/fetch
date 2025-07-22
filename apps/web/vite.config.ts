import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@fetch/shared': path.resolve(__dirname, '../../packages/shared/src'),
      theme: path.resolve(__dirname, 'src/theme'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'theme' as theme;`, // <--- fix here!
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: ['web-production-58768.up.railway.app'],
  },
});
