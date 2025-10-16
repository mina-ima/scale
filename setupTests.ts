/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { Canvas } from 'canvas';

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

// Mock for HTMLCanvasElement.getContext
Object.defineProperty(window.HTMLCanvasElement.prototype, 'getContext', {
  value: function (contextType: string) {
    if (contextType === '2d') {
      // Create a new canvas instance for each getContext call
      const canvas = new Canvas(this.width, this.height);
      return canvas.getContext('2d');
    }
    // Return null for other contexts like 'webgl' if not needed
    return null;
  },
  writable: true,
});
