import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock for window.URL.createObjectURL, which is not implemented in JSDOM
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: vi.fn() });
}

// Mock for MediaStream
if (typeof global.MediaStream === 'undefined') {
  global.MediaStream = vi.fn();
}
