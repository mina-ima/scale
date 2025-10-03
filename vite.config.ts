import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    exclude: ['e2e/**/*.spec.ts', 'node_modules/**'],
    tsconfig: 'tsconfig.test.json',
    // for node-canvas
    threads: false,
    deps: {
      inline: ['canvas'],
    },
  },
});
