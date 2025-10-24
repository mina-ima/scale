// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts', './setupTests.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    globals: true,
    // environmentOptions: { jsdom: { pretendToBeVisual: true } }, // 必要なら有効化
    // testTimeout: 30000, // 個別で長いものがあれば各 it で上書き
  },
});
