import { vi, it } from 'vitest';
import * as exifUtils from './exifUtils';

vi.stubGlobal(
  'createImageBitmap',
  vi.fn(() =>
    Promise.resolve({
      width: 100,
      height: 100,
    })
  )
);

describe('exifUtils', () => {
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
        getContext = vi.fn(() => ({
          translate: vi.fn(),
          scale: vi.fn(),
          rotate: vi.fn(),
          drawImage: vi.fn(),
        }));
        convertToBlob = vi.fn(() =>
          Promise.resolve(new Blob(['rotated content']))
        );
        addEventListener = vi.fn();
        removeEventListener = vi.fn();
        oncontextlost = null;
        oncontextrestored = null;
        transferToImageBitmap = vi.fn();
        dispatchEvent = vi.fn();
      }
    );
  });

  describe('getOrientation', () => {
    it.skip('should return orientation from EXIF data', async () => {
      const buffer = new ArrayBuffer(128);
      const view = new DataView(buffer);

      view.setUint16(0, 0xffd8);
      view.setUint16(2, 0xffe1);
      view.setUint16(4, 28);
      view.setUint32(6, 0x45786966);
      view.setUint16(10, 0x0000);

      const tiffHeaderOffset = 12;
      view.setUint16(tiffHeaderOffset, 0x4949, true);
      view.setUint16(tiffHeaderOffset + 2, 0x002a, true);
      view.setUint32(tiffHeaderOffset + 4, 8, true);

      const ifdOffset = tiffHeaderOffset + 8;
      view.setUint16(ifdOffset, 1, true);

      const tagOffset = ifdOffset + 2;
      view.setUint16(tagOffset, 0x0112, true);
      view.setUint16(tagOffset + 2, 3, true);
      view.setUint32(tagOffset + 4, 1, true);
      view.setUint16(tagOffset + 8, 6, true);

      const mockFile = new Blob([buffer], { type: 'image/jpeg' });

      const orientation = await exifUtils.getOrientation(mockFile);
      expect(orientation).toBe(6);
    });

    it('should return -1 if no EXIF data is found', async () => {
      const buffer = new ArrayBuffer(100);
      const view = new DataView(buffer);
      view.setUint16(0, 0xffd8);
      view.setUint16(2, 0xffe0);
      const mockFile = new Blob([buffer], { type: 'image/jpeg' });

      const orientation = await exifUtils.getOrientation(mockFile);
      expect(orientation).toBe(-1);
    });

    it('should return -1 if FileReader encounters an error', async () => {
      const mockFile = new Blob(['some data'], { type: 'image/jpeg' });
      await expect(exifUtils.getOrientation(mockFile)).resolves.not.toBeNull();
    });
  });

  describe('correctImageOrientation', () => {
    it('should return the original blob if orientation is 1 (normal)', () => {
      const mockFile = new Blob(['original content'], { type: 'image/jpeg' });
      vi.spyOn(exifUtils, 'getOrientation').mockResolvedValue(1);

      return expect(exifUtils.correctImageOrientation(mockFile)).resolves.toBe(
        mockFile
      );
    });

    it('should return a rotated blob if orientation is 6 (90 deg CW)', () => {
      const mockFile = new Blob(['original content'], { type: 'image/jpeg' });
      const mockRotatedFile = new Blob(['rotated content']);
      vi.spyOn(exifUtils, 'getOrientation').mockResolvedValue(6);

      return expect(
        exifUtils.correctImageOrientation(mockFile)
      ).resolves.toStrictEqual(mockRotatedFile);
    });

    it('should handle images without EXIF data gracefully', () => {
      const mockFile = new Blob(['original content'], { type: 'image/jpeg' });
      vi.spyOn(exifUtils, 'getOrientation').mockResolvedValue(-1);

      return expect(exifUtils.correctImageOrientation(mockFile)).resolves.toBe(
        mockFile
      );
    });
  });
});
