// test/setup.ts
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Create a div for the AR overlay to mount into.
// This is required for tests running components that use the WebXR DOM Overlay feature.
beforeAll(() => {
  const arOverlay = document.createElement('div');
  arOverlay.id = 'ar-overlay';
  document.body.appendChild(arOverlay);
});

vi.stubGlobal(
  'HTMLCanvasElement',
  class MockHTMLCanvasElement extends HTMLElement {
    constructor() {
      super();
      // @ts-expect-error: Mocking getContext for testing purposes.
      this.getContext = vi.fn((contextType) => {
        if (contextType === '2d') {
          return ctxMock; // Use the existing ctxMock
        }
        return null;
      });
      // @ts-expect-error: Mocking toBlob for testing purposes.
      this.toBlob = vi.fn((cb) => {
        cb(new Blob());
      });
    }
    // Add other necessary properties/methods if needed
    width = 300; // Default width for testing
    height = 150; // Default height for testing
  }
);

const ctxMock = {};
