// test/setup.ts
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const ctxMock = {
  canvas: {},
  // よく使う 2D API を最低限モック
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fillText: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  getImageData: vi.fn(() => ({ data: new Uint8ClampedArray() })),
  putImageData: vi.fn(),
  setTransform: vi.fn(),
  toDataURL: vi.fn(() => 'data:image/png;base64,'),
};

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ctxMock),
  writable: true,
});

if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function (cb: (b: Blob) => void) {
      cb(new Blob());
    },
  });
}
