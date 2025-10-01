import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
    exclude: ['e2e/**/*.spec.ts', 'node_modules/**'],
    // for node-canvas
    threads: false,
    deps: {
      inline: ['canvas'],
    },
  },
});
