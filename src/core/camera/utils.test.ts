import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getCameraStream } from './utils';

describe('getCameraStream', () => {
  const mockGetUserMedia = vi.fn();

  beforeEach(() => {
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: mockGetUserMedia },
      configurable: true,
    });
  });

  afterEach(() => {
    mockGetUserMedia.mockReset();
  });

  it('should return a MediaStream on success', async () => {
    const mockStream = {} as MediaStream;
    mockGetUserMedia.mockResolvedValue(mockStream);

    const result = await getCameraStream();
    expect(result).toBe(mockStream);
    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
  });

  it('should return CAMERA_DENIED error when permission is denied', async () => {
    const mockError = new DOMException('Permission denied', 'NotAllowedError');
    mockGetUserMedia.mockRejectedValue(mockError);

    const result = await getCameraStream();
    expect(result).toEqual({
      code: 'CAMERA_DENIED',
      message: 'Camera access denied.',
    });
    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
  });

  it('should return UNKNOWN error for other getUserMedia failures', async () => {
    const mockError = new Error('Some other error');
    mockGetUserMedia.mockRejectedValue(mockError);

    const result = await getCameraStream();
    expect(result).toEqual({
      code: 'UNKNOWN',
      message: 'Failed to get camera stream: Some other error',
    });
    expect(mockGetUserMedia).toHaveBeenCalledWith({ video: true });
  });
});
