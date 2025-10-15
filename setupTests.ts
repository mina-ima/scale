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

// Mock for navigator.mediaDevices
if (typeof navigator.mediaDevices === 'undefined') {
  Object.defineProperty(navigator, 'mediaDevices', {
    writable: true,
    value: {
      getUserMedia: vi.fn(),
    },
  });
}

// Mock for requestAnimationFrame and cancelAnimationFrame
if (typeof window.requestAnimationFrame === 'undefined') {
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: vi.fn((cb) => cb(0)), // Immediately call the callback
  });
}
if (typeof window.cancelAnimationFrame === 'undefined') {
  Object.defineProperty(window, 'cancelAnimationFrame', {
    writable: true,
    value: vi.fn(),
  });
}
