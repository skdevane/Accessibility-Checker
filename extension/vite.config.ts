import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'popup.html'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name][extname]',
        manualChunks: undefined,
      },
    },
  },
});
