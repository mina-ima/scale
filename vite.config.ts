import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  define: {
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts', './test/setup.ts'],
    exclude: ['e2e/**/*.spec.ts', 'node_modules/**'],
    tsconfig: 'tsconfig.test.json',
    // for node-canvas
    threads: false,
    deps: {
      inline: ['canvas'],
    },
  },
});
