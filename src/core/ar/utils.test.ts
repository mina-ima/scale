import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import {
  supportsWebXR,
  startXrSession,
  endXrSession,
  initHitTestSource,
  getHitTestResult,
} from './utils';

const mockRequestSession = vi.fn();
const mockXrSession: XRSession & { end: Mock } = {
  end: vi.fn(),
} as XRSession & { end: Mock };

describe('supportsWebXR', () => {
  const originalNavigatorXr = navigator.xr;

  afterEach(() => {
    Object.defineProperty(navigator, 'xr', {
      value: originalNavigatorXr,
      configurable: true,
    });
  });

  it('should return true if navigator.xr is available', () => {
    Object.defineProperty(navigator, 'xr', {
      value: {},
      configurable: true,
    });
    expect(supportsWebXR()).toBe(true);
  });

  it('should return false if navigator.xr is not available', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (navigator as any).xr;
    expect(supportsWebXR()).toBe(false);
  });
});

describe('startXrSession', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'xr', {
      value: { requestSession: mockRequestSession },
      configurable: true,
    });
    mockRequestSession.mockResolvedValue(mockXrSession);
  });

  afterEach(() => {
    mockRequestSession.mockReset();
    mockXrSession.end.mockReset();
  });

  it('should request an immersive-ar session', async () => {
    const session = await startXrSession();
    expect(mockRequestSession).toHaveBeenCalledWith('immersive-ar', {
      optionalFeatures: ['dom-overlay', 'hit-test'],
    });
    expect(session).toBe(mockXrSession);
  });

  it('should return null if session request fails', async () => {
    mockRequestSession.mockRejectedValue(new Error('Session failed'));
    const session = await startXrSession();
    expect(session).toBeNull();
  });
});

describe('endXrSession', () => {
  it('should call end on the XR session', () => {
    const mockXrSession = { end: vi.fn() } as unknown as XRSession;
    endXrSession(mockXrSession);
    expect(mockXrSession.end).toHaveBeenCalledTimes(1);
  });

  it('should not throw error if session is null or undefined', () => {
    expect(() => endXrSession(null)).not.toThrow();
    expect(() => endXrSession(undefined)).not.toThrow();
  });
});

describe('initHitTestSource', () => {
  const mockRequestReferenceSpace = vi.fn();
  const mockRequestHitTestSource = vi.fn();
  const mockXrReferenceSpace = {} as XRReferenceSpace;
  const mockXrHitTestSource = {} as XRHitTestSource;

  beforeEach(() => {
    mockXrSession.requestReferenceSpace = mockRequestReferenceSpace;
    mockXrSession.requestHitTestSource = mockRequestHitTestSource;
    mockRequestReferenceSpace.mockResolvedValue(mockXrReferenceSpace);
    mockRequestHitTestSource.mockResolvedValue(mockXrHitTestSource);
  });

  afterEach(() => {
    mockRequestReferenceSpace.mockReset();
    mockRequestHitTestSource.mockReset();
  });

  it('should request a viewer reference space and a hit test source', async () => {
    const hitTestSource = await initHitTestSource(
      mockXrSession as unknown as XRSession
    );
    expect(mockRequestReferenceSpace).toHaveBeenCalledWith('viewer');
    expect(mockRequestHitTestSource).toHaveBeenCalledWith({
      space: mockXrReferenceSpace,
    });
    expect(hitTestSource).toBe(mockXrHitTestSource);
  });

  it('should return null if reference space request fails', async () => {
    mockRequestReferenceSpace.mockRejectedValue(
      new Error('Reference space failed')
    );
    const hitTestSource = await initHitTestSource(
      mockXrSession as unknown as XRSession
    );
    expect(hitTestSource).toBeNull();
  });

  it('should return null if hit test source request fails', async () => {
    mockRequestReferenceSpace.mockResolvedValue(mockXrReferenceSpace);
    mockRequestHitTestSource.mockRejectedValue(
      new Error('Hit test source failed')
    );
    const hitTestSource = await initHitTestSource(
      mockXrSession as unknown as XRSession
    );
    expect(hitTestSource).toBeNull();
  });
});

describe('getHitTestResult', () => {
  const mockGetHitTestResults = vi.fn();
  const mockHitResultGetPose = vi.fn();
  const mockXrFrame = {
    getHitTestResults: mockGetHitTestResults,
  } as unknown as XRFrame;
  const mockXrHitTestSource = {} as XRHitTestSource;
  const mockXrReferenceSpace = {} as XRReferenceSpace;

  beforeEach(() => {
    mockGetHitTestResults.mockReset();
    mockHitResultGetPose.mockReset();
  });

  it('should return the first hit result position if available', () => {
    const mockHitResult = {
      getPose: mockHitResultGetPose,
    } as unknown as XRHitResult;
    const mockPose = {
      transform: {
        position: { x: 1, y: 2, z: 3 },
      },
    } as XRPose;
    mockGetHitTestResults.mockReturnValue([mockHitResult]);
    mockHitResultGetPose.mockReturnValue(mockPose);

    const position = getHitTestResult(
      mockXrFrame,
      mockXrHitTestSource,
      mockXrReferenceSpace
    );
    expect(mockGetHitTestResults).toHaveBeenCalledWith(mockXrHitTestSource);
    expect(mockHitResultGetPose).toHaveBeenCalledWith(mockXrReferenceSpace);
    expect(position).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('should return null if no hit results are found', () => {
    mockGetHitTestResults.mockReturnValue([]);

    const position = getHitTestResult(
      mockXrFrame,
      mockXrHitTestSource,
      mockXrReferenceSpace
    );
    expect(mockGetHitTestResults).toHaveBeenCalledWith(mockXrHitTestSource);
    expect(mockHitResultGetPose).not.toHaveBeenCalled();
    expect(position).toBeNull();
  });

  it('should return null if getPose returns null', () => {
    const mockHitResult = {
      getPose: mockHitResultGetPose,
    } as unknown as XRHitResult;
    mockGetHitTestResults.mockReturnValue([mockHitResult]);
    mockHitResultGetPose.mockReturnValue(null);

    const position = getHitTestResult(
      mockXrFrame,
      mockXrHitTestSource,
      mockXrReferenceSpace
    );
    expect(mockGetHitTestResults).toHaveBeenCalledWith(mockXrHitTestSource);
    expect(mockHitResultGetPose).toHaveBeenCalledWith(mockXrReferenceSpace);
    expect(position).toBeNull();
  });

  it('should return null if pose has no position', () => {
    const mockHitResult = {
      getPose: mockHitResultGetPose,
    } as unknown as XRHitResult;
    const mockPose = {
      transform: {},
    } as XRPose;
    mockGetHitTestResults.mockReturnValue([mockHitResult]);
    mockHitResultGetPose.mockReturnValue(mockPose);

    const position = getHitTestResult(
      mockXrFrame,
      mockXrHitTestSource,
      mockXrReferenceSpace
    );
    expect(mockGetHitTestResults).toHaveBeenCalledWith(mockXrHitTestSource);
    expect(mockHitResultGetPose).toHaveBeenCalledWith(mockXrReferenceSpace);
    expect(position).toBeNull();
  });
});
