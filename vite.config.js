import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'evogr.net/evogr.net',
  publicDir: false,
  base: '/',
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'evogr.net/evogr.net/index.html')
      },
      output: {
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
});
