/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { Canvas } from 'canvas';

// --- JSDOM Environment Mocks ---

// Mock for HTMLMediaElement to prevent errors with play() in JSDOM
if (typeof window.HTMLMediaElement.prototype.play === 'undefined') {
  Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    value: () => Promise.resolve(),
    configurable: true,
  });
}
if (typeof window.HTMLMediaElement.prototype.pause === 'undefined') {
  Object.defineProperty(window.HTMLMediaElement.prototype, 'pause', {
    value: () => {},
    configurable: true,
  });
}

// Mock Image constructor for JSDOM. It simulates a successful, synchronous image load.
Object.defineProperty(global, 'Image', {
  writable: true,
  value: class MockImage {
    onload: () => void = () => {};
    onerror: () => void = () => {};
    src = '';

    constructor() {
      // When src is set, immediately trigger onload to simulate a successful load.
      Object.defineProperty(this, 'src', {
        set: (v) => {
          if (this.onload) {
            this.onload();
          }
        },
      });
    }
  },
});

// Mock for window.URL.createObjectURL, which is not implemented in JSDOM
if (typeof window.URL.createObjectURL === 'undefined') {
  Object.defineProperty(window.URL, 'createObjectURL', {
    value: vi.fn(),
    configurable: true,
  });
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
      const canvas = new Canvas(this.width, this.height);
      const context = canvas.getContext('2d');
      // Add mocks for all canvas context methods used in the tests
      context.beginPath = vi.fn();
      context.moveTo = vi.fn();
      context.lineTo = vi.fn();
      context.stroke = vi.fn();
      context.arc = vi.fn();
      context.fill = vi.fn();
      context.fillRect = vi.fn();
      context.clearRect = vi.fn();
      context.drawImage = vi.fn();
      context.fillText = vi.fn();
      context.measureText = vi.fn(() => ({ width: 50 }));
      context.closePath = vi.fn();
      return context;
    }
    return null;
  },
  writable: true,
});

// Mock opencv-ts to prevent WASM loading issues in test environment
vi.mock('opencv-ts', () => ({
  cv: {
    onRuntimeInitialized: vi.fn((callback) => {
      if (callback) {
        callback();
      }
    }),
    imread: vi.fn(() => ({
      delete: vi.fn(),
    })),
    cvtColor: vi.fn(),
    GaussianBlur: vi.fn(),
    Canny: vi.fn(),
    findContours: vi.fn(),
    arcLength: vi.fn(),
    approxPolyDP: vi.fn(),
    isContourConvex: vi.fn(() => true),
    boundingRect: vi.fn(() => ({ width: 100, height: 100 })),
    Mat: class Mat {
      delete = vi.fn();
    },
    MatVector: class MatVector {
      size = () => 0;
      get = () => ({
        delete: vi.fn(),
      });
      delete = vi.fn();
    },
    Size: class Size {},
    Point: class Point {},
    // Constants
    COLOR_RGBA2GRAY: 0,
    RETR_EXTERNAL: 0,
    CHAIN_APPROX_SIMPLE: 0,
    BORDER_DEFAULT: 0,
  },
}));