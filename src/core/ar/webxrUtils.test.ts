import { isWebXRAvailable, startXrSession, initHitTestSource, get3dPointFromHitTest, detectPlane, stabilizePoint, handleWebXRFallback } from './webxrUtils';

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

describe('initHitTestSource', () => {
  it('should initialize a hit test source and return it', async () => {
    const mockHitTestSource = {};
    const mockReferenceSpace = {};
    const mockXRSession = {
      requestReferenceSpace: vi.fn(() => Promise.resolve(mockReferenceSpace)),
      requestHitTestSource: vi.fn(() => Promise.resolve(mockHitTestSource)),
    };

    const hitTestSource = await initHitTestSource(mockXRSession as any);
    expect(mockXRSession.requestReferenceSpace).toHaveBeenCalledWith('viewer');
    expect(mockXRSession.requestHitTestSource).toHaveBeenCalledWith({ space: mockReferenceSpace });
    expect(hitTestSource).toBe(mockHitTestSource);
  });

  it('should return null if reference space request fails', async () => {
    const mockXRSession = { requestReferenceSpace: vi.fn(() => Promise.reject(new Error('Reference space failed'))) };

    const hitTestSource = await initHitTestSource(mockXRSession as any);
    expect(hitTestSource).toBeNull();
  });

  it('should return null if hit test source request fails', async () => {
    const mockReferenceSpace = { requestHitTestSource: vi.fn(() => Promise.reject(new Error('Hit test source failed'))) };
    const mockXRSession = {
      requestReferenceSpace: vi.fn(() => Promise.resolve(mockReferenceSpace)),
      requestHitTestSource: vi.fn(() => Promise.reject(new Error('Hit test source failed'))),
    };

    const hitTestSource = await initHitTestSource(mockXRSession as any);
    expect(mockXRSession.requestHitTestSource).toHaveBeenCalled();
    expect(hitTestSource).toBeNull();
  });
});

describe('get3dPointFromHitTest', () => {
  it('should return a 3D point from a hit test result', () => {
    const mockPose = { transform: { position: { x: 1, y: 2, z: 3 } } };
    const mockHitTestResult = { getPose: vi.fn(() => mockPose) };
    const mockFrame = { getHitTestResults: vi.fn(() => [mockHitTestResult]) };
    const mockHitTestSource = {};
    const mockReferenceSpace = {};

    const point = get3dPointFromHitTest(mockFrame as any, mockHitTestSource as any, mockReferenceSpace as any);
    expect(mockFrame.getHitTestResults).toHaveBeenCalledWith(mockHitTestSource);
    expect(mockHitTestResult.getPose).toHaveBeenCalledWith(mockReferenceSpace);
    expect(point).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should return null if no hit test results are found', () => {
    const mockFrame = { getHitTestResults: vi.fn(() => []) };
    const mockHitTestSource = {};
    const mockReferenceSpace = {};

    const point = get3dPointFromHitTest(mockFrame as any, mockHitTestSource as any, mockReferenceSpace as any);
    expect(point).toBeNull();
  });

  it('should return null if the hit test result has no pose', () => {
    const mockHitTestResult = { getPose: vi.fn(() => null) };
    const mockFrame = { getHitTestResults: vi.fn(() => [mockHitTestResult]) };
    const mockHitTestSource = {};
    const mockReferenceSpace = {};

    const point = get3dPointFromHitTest(mockFrame as any, mockHitTestSource as any, mockReferenceSpace as any);
    expect(point).toBeNull();
  });
});

describe('detectPlane', () => {
  it('should return true if a plane is detected', () => {
    const mockPlane = {};
    const mockDetectedPlanes = {
      [Symbol.iterator]: vi.fn(() => ({
        next: vi.fn()
          .mockReturnValueOnce({ done: false, value: mockPlane })
          .mockReturnValueOnce({ done: true }),
      })),
    };
    const mockFrame = { detectedPlanes: mockDetectedPlanes };

    const planeDetected = detectPlane(mockFrame as any);
    expect(planeDetected).toBe(true);
  });

  it('should return false if no plane is detected', () => {
    const mockDetectedPlanes = {
      [Symbol.iterator]: vi.fn(() => ({
        next: vi.fn().mockReturnValueOnce({ done: true }),
      })),
    };
    const mockFrame = { detectedPlanes: mockDetectedPlanes };

    const planeDetected = detectPlane(mockFrame as any);
    expect(planeDetected).toBe(false);
  });
});

describe('stabilizePoint', () => {
  it('should return the same point if the history is empty or has only one point', () => {
    const point = { x: 1, y: 2, z: 3 };
    expect(stabilizePoint(point, [])).toEqual(point);
    // (1 + 10) / 2 = 5.5
    // (2 + 20) / 2 = 11
    // (3 + 30) / 2 = 16.5
    expect(stabilizePoint(point, [{ x: 10, y: 20, z: 30 }])).toEqual({ x: 5.5, y: 11, z: 16.5 });
  });

  it('should return the average of the current point and history points', () => {
    const point = { x: 1, y: 2, z: 3 };
    const history = [
      { x: 0, y: 0, z: 0 },
      { x: 2, y: 4, z: 6 },
    ];
    // (1 + 0 + 2) / 3 = 1
    // (2 + 0 + 4) / 3 = 2
    // (3 + 0 + 6) / 3 = 3
    expect(stabilizePoint(point, history)).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should limit the history size', () => {
    const point = { x: 1, y: 2, z: 3 };
    const history = [
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 10, z: 10 },
      { x: 20, y: 20, z: 20 },
      { x: 30, y: 30, z: 30 },
      { x: 40, y: 40, z: 40 },
    ]; // size 5
    // (1 + 10 + 20 + 30 + 40) / 5 = 20.2
    // (2 + 10 + 20 + 30 + 40) / 5 = 20.4
    // (3 + 10 + 20 + 30 + 40) / 5 = 20.6
    expect(stabilizePoint(point, history, 5)).toEqual({ x: 20.2, y: 20.4, z: 20.6 });

    // (1 + 30 + 40) / 3 = 23.66...
    expect(stabilizePoint(point, history, 3)).toEqual({ x: 23.666666666666668, y: 24, z: 24.333333333333332 });
  });
});

describe('handleWebXRFallback', () => {
  it('should return true if WebXR is not available', async () => {
    Object.defineProperty(navigator, 'xr', {
      value: undefined,
      configurable: true,
    });
    await expect(handleWebXRFallback()).resolves.toBe(true);
  });

  it('should return true if WebXR session request fails', async () => {
    Object.defineProperty(navigator, 'xr', {
      value: {
        isSessionSupported: async () => Promise.resolve(true),
        requestSession: vi.fn(() => Promise.reject(new Error('Session failed'))),
      },
      configurable: true,
    });
    await expect(handleWebXRFallback()).resolves.toBe(true);
  });

  it('should return false if WebXR session starts successfully', async () => {
    const mockXRSession = { end: vi.fn() };
    Object.defineProperty(navigator, 'xr', {
      value: {
        isSessionSupported: async () => Promise.resolve(true),
        requestSession: vi.fn(() => Promise.resolve(mockXRSession)),
      },
      configurable: true,
    });
    await expect(handleWebXRFallback()).resolves.toBe(false);
  });
});
