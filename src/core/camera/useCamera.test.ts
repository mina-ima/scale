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

  it('should return null stream and error initially', () => {
    const { result } = renderHook(() => useCamera());
    expect(result.current.stream).toBeNull();
    expect(result.current.error).toBeNull();
    expect(navigator.mediaDevices.getUserMedia).not.toHaveBeenCalled();
  });

  it('should request camera access and provide a stream', async () => {
    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: true,
    });
    expect(result.current.stream).toBe(mockVideoStream);
    expect(result.current.error).toBeNull();
  });

  it('should handle camera access denied error', async () => {
    const mockError = new Error('Permission denied');
    (navigator.mediaDevices.getUserMedia as Mock).mockImplementationOnce(() =>
      Promise.reject(mockError)
    );

    const { result } = renderHook(() => useCamera());

    await act(async () => {
      await result.current.startCamera();
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      video: true,
    });
    expect(result.current.stream).toBeNull();
    expect(result.current.error).toBe(mockError);
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
