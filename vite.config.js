import { defineConfig } from 'vite';

export default defineConfig({
  root: 'evogr.net/evogr.net',
  publicDir: false,
  server: {
    port: 5173,
    host: true
  }
});
