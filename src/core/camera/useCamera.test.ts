import 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCamera } from './useCamera';
import { vi, Mock } from 'vitest';

// Mock MediaDevices and MediaStream
const mockStop = vi.fn();
const mockVideoStream = {
  id: 'mock-video-stream-id',
  getTracks: () => [
    {
      stop: mockStop,
    },
  ],
  getVideoTracks: () => [
    {
      stop: mockStop,
    },
  ],
  getAudioTracks: () => [],
  active: true,
} as unknown as MediaStream;

describe('useCamera', () => {
  let originalGetUserMedia: typeof navigator.mediaDevices.getUserMedia;

  beforeAll(() => {
    originalGetUserMedia = navigator.mediaDevices.getUserMedia;
  });

  beforeEach(() => {
    // Reset mock before each test
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        ...navigator.mediaDevices,
        getUserMedia: vi.fn(() => Promise.resolve(mockVideoStream)),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    // Restore original getUserMedia after all tests
    Object.defineProperty(navigator, 'mediaDevices', {
      writable: true,
      value: {
        ...navigator.mediaDevices,
        getUserMedia: originalGetUserMedia,
      },
    });
  });

  it('should call getUserMedia on mount via useEffect', async () => {
    const { result } = renderHook(() => useCamera());
    // It should be called once on mount
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(1);
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
    });

    // Wait for the stream to be set
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.stream).toBe(mockVideoStream);
    expect(result.current.error).toBeNull();
  });

  it('should request camera access and provide a stream', async () => {
    const { result } = renderHook(() => useCamera());

    // Called once on mount
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.startCamera();
    });

    // Called again by startCamera
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledTimes(2);
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
    });
    expect(result.current.stream).toBe(mockVideoStream);
    expect(result.current.error).toBeNull();
  });

  it('should handle camera access denied error', async () => {
    const mockError = new DOMException('Permission denied', 'NotAllowedError');
    (navigator.mediaDevices.getUserMedia as Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
    });
    expect(result.current.stream).toBeNull();
    expect(result.current.error).toEqual(
      expect.objectContaining({
        code: 'CAMERA_DENIED',
      })
    );
  });

  it('should stop the stream when stopCamera is called', async () => {
    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    await act(async () => {
      result.current.stopCamera();
    });

    expect(mockStop).toHaveBeenCalled();
    expect(result.current.stream).toBeNull();
  });
});
