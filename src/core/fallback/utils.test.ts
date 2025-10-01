import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import {
  capturePhoto,
  getTapCoordinates,
  prepareProjectiveTransformation,
} from './utils';

describe('capturePhoto', () => {
  let mockVideoElement: HTMLVideoElement & {
    triggerLoadedMetadata: () => void;
  };
  let mockCanvasElement: HTMLCanvasElement & { toBlob: Mock; getContext: Mock };
  let mockCanvasContext: CanvasRenderingContext2D & { drawImage: Mock };
  let originalCreateElement: typeof document.createElement;

  beforeEach(() => {
    vi.useFakeTimers();
    originalCreateElement = document.createElement;

    let onLoadedMetadataCallback: (() => void) | null = null;
    mockVideoElement = {
      srcObject: {} as MediaStream,
      set onloadedmetadata(callback: (() => void) | null) {
        onLoadedMetadataCallback = callback;
      },
      get onloadedmetadata() {
        return onLoadedMetadataCallback;
      },
      videoWidth: 1920,
      videoHeight: 1080,
      triggerLoadedMetadata: () => {
        if (onLoadedMetadataCallback) {
          onLoadedMetadataCallback();
        }
      },
    } as Partial<HTMLVideoElement> as HTMLVideoElement & {
      triggerLoadedMetadata: () => void;
    };

    mockCanvasContext = {
      drawImage: vi.fn(),
      canvas: { toBlob: vi.fn() as Mock } as unknown as HTMLCanvasElement,
    } as CanvasRenderingContext2D & { drawImage: Mock };

    mockCanvasElement = {
      getContext: vi.fn(() => mockCanvasContext) as Mock,
      width: 0,
      height: 0,
      toBlob: vi.fn(),
    } as HTMLCanvasElement & { toBlob: Mock; getContext: Mock };

    vi.spyOn(document, 'createElement').mockImplementation(
      (tagName: string) => {
        if (tagName === 'video') {
          return mockVideoElement;
        }
        if (tagName === 'canvas') {
          return mockCanvasElement;
        }
        return originalCreateElement(tagName);
      }
    );
  });

  afterEach(() => {
    document.createElement = originalCreateElement;
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('should capture a photo from the video stream and return a Blob', async () => {
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    mockCanvasElement.toBlob.mockImplementationOnce((callback: BlobCallback) =>
      callback(mockBlob)
    );

    const stream = {} as MediaStream;
    const capturePromise = capturePhoto(stream, 1080);

    // onloadedmetadataが設定されるのを待つ
    await vi.runOnlyPendingTimersAsync();

    // onloadedmetadataに設定されたコールバックを呼び出す
    mockVideoElement.triggerLoadedMetadata(); // コールバックを実行

    const result = await capturePromise;

    expect(document.createElement).toHaveBeenCalledWith('video');
    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockVideoElement.srcObject).toBe(stream);
    expect(mockCanvasElement.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvasContext.drawImage).toHaveBeenCalledWith(
      mockVideoElement,
      0,
      0,
      1920,
      1080
    );
    expect(mockCanvasElement.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/png',
      1
    );
    expect(result).toBe(mockBlob);
  });

  it('should resize the image to meet the minimum length requirement', async () => {
    Object.defineProperty(mockVideoElement, 'videoWidth', {
      writable: true,
      value: 800,
    });
    Object.defineProperty(mockVideoElement, 'videoHeight', {
      writable: true,
      value: 600,
    });
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    mockCanvasElement.toBlob.mockImplementationOnce((callback: BlobCallback) =>
      callback(mockBlob)
    );

    const stream = {} as MediaStream;
    const capturePromise = capturePhoto(stream, 1080);

    await vi.runOnlyPendingTimersAsync();

    mockVideoElement.triggerLoadedMetadata();

    await capturePromise;

    // Expect canvas to be resized to 1080x810 (maintaining aspect ratio, min length 1080)
    expect(mockCanvasElement.width).toBe(1080);
    expect(mockCanvasElement.height).toBe(810);
    expect(mockCanvasContext.drawImage).toHaveBeenCalledWith(
      mockVideoElement,
      0,
      0,
      1080,
      810
    );
  });

  it('should handle cases where video dimensions are already larger than min length', async () => {
    Object.defineProperty(mockVideoElement, 'videoWidth', {
      writable: true,
      value: 2000,
    });
    Object.defineProperty(mockVideoElement, 'videoHeight', {
      writable: true,
      value: 1500,
    });
    const mockBlob = new Blob(['test'], { type: 'image/png' });
    mockCanvasElement.toBlob.mockImplementationOnce((callback: BlobCallback) =>
      callback(mockBlob)
    );

    const stream = {} as MediaStream;
    const capturePromise = capturePhoto(stream, 1080);

    await vi.runOnlyPendingTimersAsync();

    mockVideoElement.triggerLoadedMetadata();

    await capturePromise;

    // Expect canvas to use original video dimensions
    expect(mockCanvasElement.width).toBe(2000);
    expect(mockCanvasElement.height).toBe(1500);
    expect(mockCanvasContext.drawImage).toHaveBeenCalledWith(
      mockVideoElement,
      0,
      0,
      2000,
      1500
    );
  });

  it('should return null if toBlob fails', async () => {
    mockCanvasElement.toBlob.mockImplementationOnce((callback: BlobCallback) =>
      callback(null)
    );

    const stream = {} as MediaStream;
    const capturePromise = capturePhoto(stream, 1080);

    await vi.runOnlyPendingTimersAsync();

    mockVideoElement.triggerLoadedMetadata();

    const result = await capturePromise;

    expect(result).toBeNull();
  });

  it('should return null if getContext returns null', async () => {
    mockCanvasElement.getContext.mockReturnValue(null);

    const stream = {} as MediaStream;
    const capturePromise = capturePhoto(stream, 1080);

    await vi.runOnlyPendingTimersAsync();

    mockVideoElement.triggerLoadedMetadata();

    const result = await capturePromise;

    expect(result).toBeNull();
  });
});

describe('getTapCoordinates', () => {
  it('should return correct image coordinates for a tap event', () => {
    const mockEvent = { clientX: 60, clientY: 45 } as MouseEvent;
    const mockRect = {
      left: 10,
      top: 20,
      width: 100,
      height: 50,
    } as DOMRect;

    const mockElement = {
      getBoundingClientRect: () => mockRect,
      naturalWidth: 200,
      naturalHeight: 100,
      videoWidth: 0,
      videoHeight: 0,
    };

    const result = getTapCoordinates(mockEvent, mockElement);

    expect(result).toEqual({ x: 100, y: 50 });
  });
});

describe('prepareProjectiveTransformation', () => {
  it('should return the points if exactly 4 points are provided', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
    ];
    expect(prepareProjectiveTransformation(points)).toEqual(points);
  });

  it('should throw an error if less than 4 points are provided', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    expect(() => prepareProjectiveTransformation(points)).toThrow(
      'Projective transformation requires exactly 4 points.'
    );
  });

  it('should throw an error if more than 4 points are provided', () => {
    const points = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x: 0.5, y: 0.5 },
    ];
    expect(() => prepareProjectiveTransformation(points)).toThrow(
      'Projective transformation requires exactly 4 points.'
    );
  });
});
