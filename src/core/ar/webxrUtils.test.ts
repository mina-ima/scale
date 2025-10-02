import { isWebXRAvailable, startXrSession } from './webxrUtils';

describe('isWebXRAvailable', () => {
  it('should return true if WebXR is available', async () => {
    // Mock the navigator.xr object to simulate WebXR availability
    Object.defineProperty(navigator, 'xr', {
      value: {
        isSessionSupported: async (sessionMode: string) => Promise.resolve(sessionMode === 'immersive-ar'),
      },
      configurable: true,
    });

    await expect(isWebXRAvailable()).resolves.toBe(true);
  });

  it('should return false if WebXR is not available', async () => {
    // Mock the navigator.xr object to simulate WebXR unavailability
    Object.defineProperty(navigator, 'xr', {
      value: undefined,
      configurable: true,
    });

    await expect(isWebXRAvailable()).resolves.toBe(false);
  });

  it('should return false if immersive-ar session is not supported', async () => {
    // Mock the navigator.xr object to simulate WebXR availability but no immersive-ar support
    Object.defineProperty(navigator, 'xr', {
      value: {
        isSessionSupported: async (sessionMode: string) => Promise.resolve(sessionMode !== 'immersive-ar'),
      },
      configurable: true,
    });

    await expect(isWebXRAvailable()).resolves.toBe(false);
  });
});

describe('startXrSession', () => {
  it('should start an immersive-ar session and return an XR session object', async () => {
    const mockXRSession = { end: vi.fn() };
    const mockXRSystem = {
      requestSession: vi.fn(() => Promise.resolve(mockXRSession)),
    };
    Object.defineProperty(navigator, 'xr', {
      value: mockXRSystem,
      configurable: true,
    });

    const session = await startXrSession();
    expect(mockXRSystem.requestSession).toHaveBeenCalledWith('immersive-ar', { optionalFeatures: ['dom-overlay', 'hit-test'] });
    expect(session).toBe(mockXRSession);
  });

  it('should return null if session request fails', async () => {
    const mockXRSystem = {
      requestSession: vi.fn(() => Promise.reject(new Error('Session failed'))),
    };
    Object.defineProperty(navigator, 'xr', {
      value: mockXRSystem,
      configurable: true,
    });

    const session = await startXrSession();
    expect(session).toBeNull();
  });
});
