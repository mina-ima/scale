import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCameraStream, stopCameraStream } from './utils';

describe('getCameraStream', () => {
  const mockGetUserMedia = vi.fn();

  beforeEach(() => {
    // @ts-expect-error - Mocking navigator.mediaDevices for testing
    navigator.mediaDevices = { getUserMedia: mockGetUserMedia };
  });

  afterEach(() => {
    mockGetUserMedia.mockReset();
  });

  it('should return a MediaStream on success', async () => {
    const mockStream = {} as MediaStream;
    mockGetUserMedia.mockResolvedValue(mockStream);

    const result = await getCameraStream('environment');
    expect(result).toBe(mockStream);
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
    });
  });

  it('should return CAMERA_DENIED error when permission is denied', async () => {
    const mockError = new DOMException('Permission denied', 'NotAllowedError');
    mockGetUserMedia.mockRejectedValue(mockError);

    const result = await getCameraStream('environment');
    expect(result).toEqual(
      expect.objectContaining({
        code: 'CAMERA_DENIED',
        message: 'Camera access denied.',
      })
    );
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
    });
  });

  it('should return UNKNOWN error for other getUserMedia failures', async () => {
    const mockError = new Error('Some other error');
    mockGetUserMedia.mockRejectedValue(mockError);

    const result = await getCameraStream('environment');
    expect(result).toEqual(
      expect.objectContaining({
        code: 'UNKNOWN',
        message: 'Failed to get camera stream: Some other error',
      })
    );
    expect(mockGetUserMedia).toHaveBeenCalledWith({
      video: { facingMode: 'environment' },
    });
  });
});

describe('stopCameraStream', () => {
  it('should stop all tracks in the MediaStream', () => {
    const mockTrack1 = { stop: vi.fn() } as unknown as MediaStreamTrack;
    const mockTrack2 = { stop: vi.fn() } as unknown as MediaStreamTrack;
    const mockStream = {
      getTracks: vi.fn(() => [mockTrack1, mockTrack2]),
    } as unknown as MediaStream;

    stopCameraStream(mockStream);

    expect(mockStream.getTracks).toHaveBeenCalledTimes(1);
    expect(mockTrack1.stop).toHaveBeenCalledTimes(1);
    expect(mockTrack2.stop).toHaveBeenCalledTimes(1);
  });

  it('should not throw error if stream is null or undefined', () => {
    expect(() => stopCameraStream(null)).not.toThrow();
    expect(() => stopCameraStream(undefined)).not.toThrow();
  });
});
