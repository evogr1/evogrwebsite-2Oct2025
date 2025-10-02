import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'evogr.net/evogr.net',
  publicDir: false,
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'evogr.net/evogr.net/index.html')
      }
    }
  }
});
