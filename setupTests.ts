import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock for window.URL.createObjectURL, which is not implemented in JSDOM
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', { value: vi.fn() });
}
