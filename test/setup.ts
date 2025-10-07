// test/setup.ts
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.stubGlobal('HTMLCanvasElement', class MockHTMLCanvasElement extends HTMLElement {
  constructor() {
    super();
    // @ts-expect-error
    this.getContext = vi.fn((contextType) => {
      if (contextType === '2d') {
        return ctxMock; // Use the existing ctxMock
      }
      return null;
    });
    // @ts-expect-error
    this.toBlob = vi.fn((cb) => {
      cb(new Blob());
    });
  }
  // Add other necessary properties/methods if needed
  width = 300; // Default width for testing
  height = 150; // Default height for testing
});

const ctxMock = {
