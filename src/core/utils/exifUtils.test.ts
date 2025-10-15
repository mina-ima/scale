// src/core/utils/exifUtils.test.ts
import { vi, it, describe, expect, beforeAll, beforeEach } from 'vitest';
import * as exifUtils from './exifUtils';
import { createJpegWithExifOrientation } from '../../test-helpers/createJpegWithExif';

// Mock Blob and other globals locally for this test file
vi.stubGlobal(
  'Blob',
  class MockBlob extends Blob {
    #buffer: ArrayBuffer;
    static shouldReject = false;

    constructor(blobParts?: BlobPart[], options?: BlobPropertyBag) {
      super(blobParts, options);
      if (blobParts && blobParts.length > 0) {
        const part = blobParts[0];
        if (part instanceof Uint8Array) {
          this.#buffer = new Uint8Array(
            part.buffer,
            part.byteOffset,
            part.byteLength
          ).slice().buffer;
        } else if (part instanceof ArrayBuffer) {
          this.#buffer = part;
        } else if (typeof part === 'string') {
          this.#buffer = new TextEncoder().encode(part).buffer;
        } else {
          this.#buffer = new ArrayBuffer(0);
        }
      } else {
        this.#buffer = new ArrayBuffer(0);
      }

      this.arrayBuffer = vi.fn(async () => {
        if ((this.constructor as typeof MockBlob).shouldReject) {
          throw new Error('Read error');
        }
        return this.#buffer;
      });
    }
  }
);

vi.stubGlobal(
  'createImageBitmap',
  vi.fn(() =>
    Promise.resolve({
      width: 100,
      height: 100,
      close: vi.fn(),
    })
  )
);

describe('exifUtils', () => {
  const mockContext = {
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    drawImage: vi.fn(),
  };

  beforeAll(() => {
    vi.stubGlobal(
      'OffscreenCanvas',
      class {
        width: number;
        height: number;
        constructor(width: number, height: number) {
          this.width = width;
          this.height = height;
        }
        getContext = vi.fn(() => mockContext);
        convertToBlob = vi.fn(() =>
          Promise.resolve(new Blob(['rotated content']))
        );
      }
    );
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    mockContext.translate.mockClear();
    mockContext.scale.mockClear();
    mockContext.rotate.mockClear();
    mockContext.drawImage.mockClear();
    // @ts-expect-error - Resetting static property
    (Blob as any).shouldReject = false;
  });

  describe('getOrientation', () => {
    it('should return orientation from EXIF data', async () => {
      const buffer = createJpegWithExifOrientation(6);
      const mockFile = new Blob([new Uint8Array(buffer)], {
        type: 'image/jpeg',
      });
      const orientation = await exifUtils.getOrientation(mockFile);
      expect(orientation).toBe(6);
    });

    it('should return -1 if no EXIF data is found', async () => {
      const buffer = new ArrayBuffer(100);
      const view = new DataView(buffer);
      view.setUint16(0, 0xffd8, false); // SOI
      view.setUint16(2, 0xffe0, false); // APP0 (no EXIF)
      const mockFile = new Blob([new Uint8Array(buffer)], {
        type: 'image/jpeg',
      });
      const orientation = await exifUtils.getOrientation(mockFile);
      expect(orientation).toBe(-1);
    });

    it('should return -1 if arrayBuffer read fails', async () => {
      const mockFile = new Blob(['some data'], { type: 'image/jpeg' });
      // @ts-expect-error - Accessing static property for test control
      (Blob as any).shouldReject = true;
      const orientation = await exifUtils.getOrientation(mockFile);
      expect(orientation).toBe(-1);
    });
  });

  describe('correctImageOrientation', () => {
    it('should return the original blob if orientation is 1 (normal)', async () => {
      const mockFile = new Blob(['original content'], { type: 'image/jpeg' });
      vi.spyOn(exifUtils, 'getOrientation').mockResolvedValue(1);
      const result = await exifUtils.correctImageOrientation(mockFile);
      expect(result).toBe(mockFile);
    });

    it('should return a rotated blob if orientation is 6 (90 deg CW)', async () => {
      const mockFile = new Blob(['original content'], { type: 'image/jpeg' });
      vi.spyOn(exifUtils, 'getOrientation').mockResolvedValue(6);

      const resultBlob = await exifUtils.correctImageOrientation(mockFile);

      expect(mockContext.translate).toHaveBeenCalledWith(100, 0);
      expect(mockContext.rotate).toHaveBeenCalledWith(0.5 * Math.PI);
      expect(mockContext.drawImage).toHaveBeenCalledWith(expect.any(Object), 0, 0);

      expect(resultBlob).toBeInstanceOf(Blob);
      const text = await resultBlob.text();
      expect(text).toBe('rotated content');
    });

    it('should handle images without EXIF data gracefully', async () => {
      const mockFile = new Blob(['original content'], { type: 'image/jpeg' });
      vi.spyOn(exifUtils, 'getOrientation').mockResolvedValue(-1);
      const result = await exifUtils.correctImageOrientation(mockFile);
      expect(result).toBe(mockFile);
    });
  });
});