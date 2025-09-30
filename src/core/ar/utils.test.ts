import { describe, it, expect } from 'vitest';
import { supportsWebXR } from './utils';

describe('supportsWebXR', () => {
  it('should return true if navigator.xr is available', () => {
    // Mock navigator.xr to simulate WebXR availability
    Object.defineProperty(navigator, 'xr', {
      value: {},
      configurable: true,
    });
    expect(supportsWebXR()).toBe(true);
  });

  it('should return false if navigator.xr is not available', () => {
    // Mock navigator.xr to simulate WebXR unavailability
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).xr;
    expect(supportsWebXR()).toBe(false);
  });
});
