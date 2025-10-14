import { vi } from 'vitest';

vi.mock('../../core/measure/calculate3dDistance', () => ({
  calculate3dDistance: vi.fn(),
}));

import {
  isWebXRAvailable,
  startXrSession,
  initHitTestSource,
  get3dPointFromHitTest,
  detectPlane,
  stabilizePoint,
  handleWebXRFallback,
  getPlaneDetectionMessage,
  performARMeasurement,
  arHelpers,
} from './webxrUtils';
import { calculate3dDistance } from '../../core/measure/calculate3dDistance';

declare global {
  interface Window {
    mockWebXr: {
      startSession: () => void;
      setPlaneDetected: (detected: boolean) => void;
      addHitTestPoint: (point: [number, number, number]) => void;
    };
  }
}

describe('webxrUtils', () => {
  describe('isWebXRAvailable', () => {
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
          isSessionSupported: async (sessionMode: string) =>
            Promise.resolve(sessionMode !== 'immersive-ar'),
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
      expect(mockXRSystem.requestSession).toHaveBeenCalledWith('immersive-ar', {
        optionalFeatures: ['hit-test'],
      });
      expect(session).toBe(mockXRSession);
    });

    it('should throw a user-friendly error for NotAllowedError', async () => {
      const mockXRSystem = {
        requestSession: vi.fn(() =>
          Promise.reject(
            new DOMException('Permission denied', 'NotAllowedError')
          )
        ),
      };
      Object.defineProperty(navigator, 'xr', {
        value: mockXRSystem,
        configurable: true,
      });

      await expect(startXrSession()).rejects.toThrow(
        'ARセッションの開始が許可されませんでした。カメラへのアクセスを許可してください。'
      );
    });

    it('should throw a user-friendly error for NotFoundError', async () => {
      const mockXRSystem = {
        requestSession: vi.fn(() =>
          Promise.reject(
            new DOMException('No AR session found', 'NotFoundError')
          )
        ),
      };
      Object.defineProperty(navigator, 'xr', {
        value: mockXRSystem,
        configurable: true,
      });

      await expect(startXrSession()).rejects.toThrow(
        'お使いのデバイスはARをサポートしていないか、AR機能が有効になっていません。'
      );
    });

    it('should throw a generic error for other DOMExceptions', async () => {
      const mockXRSystem = {
        requestSession: vi.fn(() =>
          Promise.reject(new DOMException('Unknown error', 'UnknownError'))
        ),
      };
      Object.defineProperty(navigator, 'xr', {
        value: mockXRSystem,
        configurable: true,
      });

      await expect(startXrSession()).rejects.toThrow(
        'ARセッションの開始中に不明なエラーが発生しました。'
      );
    });

    it('should throw the original error for non-DOMExceptions', async () => {
      const mockXRSystem = {
        requestSession: vi.fn(() => Promise.reject(new Error('Generic error'))),
      };
      Object.defineProperty(navigator, 'xr', {
        value: mockXRSystem,
        configurable: true,
      });

      await expect(startXrSession()).rejects.toThrow('Generic error');
    });
  });

  describe('initHitTestSource', () => {
    it('should initialize a hit test source and return it', async () => {
      const mockHitTestSource = {} as unknown as XRHitTestSource; // Define it here
      const mockReferenceSpace = {} as unknown as XRReferenceSpace;
      const mockXRSession = {
        requestReferenceSpace: vi.fn(() => Promise.resolve(mockReferenceSpace)),
        requestHitTestSource: vi.fn(() => Promise.resolve(mockHitTestSource)),
      } as unknown as XRSession;

      const hitTestSource = await initHitTestSource(mockXRSession);
      expect(mockXRSession.requestReferenceSpace).toHaveBeenCalledWith(
        'viewer'
      );
      expect(mockXRSession.requestHitTestSource).toHaveBeenCalledWith({
        space: mockReferenceSpace,
      });
      expect(hitTestSource).toBe(mockHitTestSource);
    });

    it('should return null if reference space request fails', async () => {
      const mockXRSession = {
        requestReferenceSpace: vi.fn(() =>
          Promise.reject(new Error('Reference space failed'))
        ),
      } as unknown as XRSession;

      const hitTestSource = await initHitTestSource(mockXRSession);
      expect(hitTestSource).toBeNull();
    });

    it('should return null if hit test source request fails', async () => {
      const mockReferenceSpace = {
        requestHitTestSource: vi.fn(() =>
          Promise.reject(new Error('Hit test source failed'))
        ),
      } as unknown as XRReferenceSpace;
      const mockXRSession = {
        requestReferenceSpace: vi.fn(() => Promise.resolve(mockReferenceSpace)),
        requestHitTestSource: vi.fn(() =>
          Promise.reject(new Error('Hit test source failed'))
        ),
      } as unknown as XRSession;

      const hitTestSource = await initHitTestSource(mockXRSession);
      expect(mockXRSession.requestHitTestSource).toHaveBeenCalled();
      expect(hitTestSource).toBeNull();
    });
  });

  describe('get3dPointFromHitTest', () => {
    it('should return a 3D point from a hit test result', () => {
      const mockPose = {
        transform: { position: { x: 1, y: 2, z: 3 } },
      } as unknown as XRPose;
      const mockHitTestResult = {
        getPose: vi.fn(() => mockPose),
      } as unknown as XRHitTestResult;
      const mockHitTestSource = {} as unknown as XRHitTestSource;
      const mockReferenceSpace = {} as unknown as XRReferenceSpace;
      const mockFrame = {
        getHitTestResults: vi.fn(() => [mockHitTestResult]),
      } as unknown as XRFrame; // Define mockFrame here

      const point = get3dPointFromHitTest(
        mockFrame,
        mockHitTestSource as XRHitTestSource,
        mockReferenceSpace as XRReferenceSpace
      );
      expect(mockFrame.getHitTestResults).toHaveBeenCalledWith(
        mockHitTestSource
      );
      expect(mockHitTestResult.getPose).toHaveBeenCalledWith(
        mockReferenceSpace
      );
      expect(point).toEqual({ x: 1, y: 2, z: 3 });
    });

    it('should return null if no hit test results are found', () => {
      const mockHitTestSource = {} as unknown as XRHitTestSource;
      const mockReferenceSpace = {} as unknown as XRReferenceSpace;
      const mockFrame = {
        getHitTestResults: vi.fn(() => []),
      } as unknown as XRFrame;

      const point = get3dPointFromHitTest(
        mockFrame,
        mockHitTestSource,
        mockReferenceSpace
      );
      expect(mockFrame.getHitTestResults).toHaveBeenCalledWith(
        mockHitTestSource
      );
      expect(point).toBeNull();
    });

    it('should return null if the hit test result has no pose', () => {
      const mockHitTestResult = {
        getPose: vi.fn(() => null),
      } as unknown as XRHitTestResult;
      const mockHitTestSource = {} as unknown as XRHitTestSource;
      const mockReferenceSpace = {} as unknown as XRReferenceSpace;
      const mockFrame = {
        getHitTestResults: vi.fn(() => [mockHitTestResult]),
      } as unknown as XRFrame; // Define mockFrame here

      const point = get3dPointFromHitTest(
        mockFrame,
        mockHitTestSource as XRHitTestSource,
        mockReferenceSpace as XRReferenceSpace
      );
      expect(point).toBeNull();
    });
  });

  describe('detectPlane', () => {
    it('should return true if a plane is detected', () => {
      const mockFrame = {
        detectedPlanes: {
          [Symbol.iterator]: vi.fn(() => ({
            next: vi
              .fn()
              .mockReturnValueOnce({ done: false, value: {} as XRPlane })
              .mockReturnValueOnce({ done: true }),
          })),
        } as unknown as XRPlaneSet,
        getHitTestResults: vi.fn(),
      } as unknown as XRFrame;

      const planeDetected = detectPlane(mockFrame);
      expect(planeDetected).toBe(true);
    });

    it('should return false if no plane is detected', () => {
      const mockDetectedPlanes = {
        [Symbol.iterator]: vi.fn(() => ({
          next: vi.fn().mockReturnValueOnce({ done: true }),
        })),
      } as unknown as XRPlaneSet;
      const mockFrame = {
        detectedPlanes: mockDetectedPlanes,
        getHitTestResults: vi.fn(),
      } as unknown as XRFrame;

      const planeDetected = detectPlane(mockFrame as unknown as XRFrame);
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
      expect(stabilizePoint(point, [{ x: 10, y: 20, z: 30 }])).toEqual({
        x: 5.5,
        y: 11,
        z: 16.5,
      });
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
      expect(stabilizePoint(point, history, 5)).toEqual({
        x: 20.2,
        y: 20.4,
        z: 20.6,
      });

      // (1 + 30 + 40) / 3 = 23.66...
      expect(stabilizePoint(point, history, 3)).toEqual({
        x: 23.666666666666668,
        y: 24,
        z: 24.333333333333332,
      });
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
          requestSession: vi.fn(() =>
            Promise.reject(new Error('Session failed'))
          ),
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

  describe('getPlaneDetectionMessage', () => {
    it('should return null if a plane is detected', () => {
      const mockFrame = {
        detectedPlanes: {
          [Symbol.iterator]: () => ({
            next: () => ({ done: false, value: {} as XRPlane }),
          }),
        } as unknown as XRPlaneSet,
        getHitTestResults: vi.fn(),
      } as unknown as XRFrame;
      expect(getPlaneDetectionMessage(mockFrame)).toBeNull();
    });

    it('should return a message if no plane is detected', () => {
      const mockFrame = {
        detectedPlanes: {
          [Symbol.iterator]: () => ({ next: () => ({ done: true }) }),
        } as unknown as XRPlaneSet,
        getHitTestResults: vi.fn(),
      } as unknown as XRFrame;
      expect(getPlaneDetectionMessage(mockFrame)).toBe(
        '床や壁を映してください'
      );
    });
  });

  describe('performARMeasurement', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
    it('should calculate the distance between two 3D points obtained from hit tests', async () => {
      const mockPoint1 = { x: 1, y: 2, z: 3 };
      const mockPoint2 = { x: 4, y: 5, z: 6 };
      const mockDistance = 5.196; // sqrt((4-1)^2 + (5-2)^2 + (6-3)^2) = sqrt(9+9+9) = sqrt(27) approx 5.196

      const mockPose1 = {
        transform: { position: mockPoint1 },
      } as unknown as XRPose;
      const mockPose2 = {
        transform: { position: mockPoint2 },
      } as unknown as XRPose;

      const mockHitTestResult1 = {
        getPose: vi.fn(() => mockPose1),
      } as unknown as XRHitTestResult;
      const mockHitTestResult2 = {
        getPose: vi.fn(() => mockPose2),
      } as unknown as XRHitTestResult;

      const mockHitTestSource = {} as unknown as XRHitTestSource;
      const mockReferenceSpace = {} as unknown as XRReferenceSpace;

      const mockFrame = {
        getHitTestResults: vi
          .fn()
          .mockReturnValueOnce([mockHitTestResult1])
          .mockReturnValueOnce([mockHitTestResult2]),
      } as unknown as XRFrame;

      // Mock get3dPointFromHitTest to return our predefined points
      const get3dPointFromHitTestSpy = vi.spyOn(
        arHelpers,
        'get3dPointFromHitTest'
      );
      get3dPointFromHitTestSpy.mockReturnValueOnce(mockPoint1);
      get3dPointFromHitTestSpy.mockReturnValueOnce(mockPoint2);

      // Mock calculate3dDistance from src/core/measure/calculate3dDistance.ts
      vi.mocked(calculate3dDistance).mockReturnValue(mockDistance);

      const result = await performARMeasurement(
        mockFrame,
        mockHitTestSource,
        mockReferenceSpace
      );

      expect(get3dPointFromHitTestSpy).toHaveBeenCalledTimes(2);
      expect(vi.mocked(calculate3dDistance)).toHaveBeenCalledWith(
        mockPoint1,
        mockPoint2
      );
      expect(result).toBe(mockDistance);
    });
  });
});
