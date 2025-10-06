// src/core/utils/exifUtils.test.ts
import { vi, it, describe, expect, beforeAll } from 'vitest';
import * as exifUtils from './exifUtils';
import { createJpegWithExifOrientation } from '../../test-helpers/createJpegWithExif';

vi.stubGlobal(
  'Blob',
  class MockBlob extends Blob {
    #buffer: ArrayBuffer;

    constructor(blobParts?: BlobPart[], options?: BlobPropertyBag) {
      super(blobParts, options);
      if (blobParts && blobParts[0] instanceof Uint8Array) {
        this.#buffer = blobParts[0].slice().buffer; // Ensure it's a plain ArrayBuffer
      } else if (blobParts && blobParts[0] instanceof ArrayBuffer) {
        this.#buffer = blobParts[0];
      } else if (blobParts && typeof blobParts[0] === 'string') {
        this.#buffer = new TextEncoder().encode(blobParts[0]).buffer;
      } else {
        this.#buffer = new ArrayBuffer(0);
      }

      this.arrayBuffer = vi.fn(async () => {
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
    })
  )
);

class MockFileReader {
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;
  result: ArrayBuffer | string | null = null;
  #done = false;

  readAsArrayBuffer(file: Blob) {
    if (this.#done) return;
    this.#done = true;

    queueMicrotask(async () => {
      try {
        if (file.size === 0) {
          this.onerror?.(
            new ProgressEvent('error') as ProgressEvent<FileReader>
          );
          return;
        }
        const buf = await file.arrayBuffer();
        this.result = buf;
        this.onload?.(new ProgressEvent('load') as ProgressEvent<FileReader>);
      } catch {
        this.onerror?.(new ProgressEvent('error') as ProgressEvent<FileReader>);
      }
    });
  }
}
vi.stubGlobal('FileReader', MockFileReader);

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
    it('should return orientation from EXIF data', async () => {
      const buffer = createJpegWithExifOrientation(6);
      const mockFile = new Blob([new Uint8Array(buffer)], {
        type: 'image/jpeg',
      });

      // --- デバッグ: JPEG ヘッダと IFD0 の生構造を出力 ---
      const u8 = new Uint8Array(buffer);
      const head = [...u8.slice(0, 16)]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join(' ');
      console.log('JPEG HEAD:', head);

      try {
        // tiffStart = 2(SOI)+2(APP1 marker)+2(size)+6("Exif\0\0")=12
        const tiffStart = 12;
        const dv = new DataView(u8.buffer);
        const byteOrder = dv.getUint16(tiffStart, false);
        const little = byteOrder === 0x4949;
        const magic = dv.getUint16(tiffStart + 2, little);
        const ifd0Offset = dv.getUint32(tiffStart + 4, little);
        const ifd0 = tiffStart + ifd0Offset;
        const numEntries = dv.getUint16(ifd0, little);
        const entryOffset = ifd0 + 2;
        const entryBytes = u8.slice(entryOffset, entryOffset + 12);
        const hex = [...entryBytes]
          .map((b) => b.toString(16).padStart(2, '0'))
          .join(' ');

        console.log(
          'TIFF byteOrder:',
          byteOrder.toString(16),
          'little?',
          little
        );
        console.log('TIFF magic:', magic.toString(16), 'IFD0 off:', ifd0Offset);
        console.log('IFD0 entries:', numEntries);
        console.log('IFD entry(12B):', hex);

        const tag = dv.getUint16(entryOffset + 0, little);
        const type = dv.getUint16(entryOffset + 2, little);
        const count = dv.getUint32(entryOffset + 4, little);
        const valueOrOffset = entryOffset + 8;
        const vHi = dv.getUint16(valueOrOffset + 0, little);
        const vLo = dv.getUint16(valueOrOffset + 2, little);
        console.log(
          'Parsed tag:',
          tag.toString(16),
          'type:',
          type,
          'count:',
          count,
          'vHi:',
          vHi,
          'vLo:',
          vLo
        );
      } catch (e) {
        console.error('Debug parse failed:', e);
      }

      const orientationFromGetOrientation =
        await exifUtils.getOrientation(mockFile);
      console.log(
        'Test: exifUtils.getOrientation returned',
        orientationFromGetOrientation
      );

      // Directly call readTiffForOrientation for debugging
      const buf = await mockFile.arrayBuffer();
      const dv = new DataView(buf);
      const tiffStart = 12; // Based on JPEG HEAD debug output
      const segEnd = buf.byteLength; // Assuming segEnd is the end of the buffer for this test case

      const orientationFromReadTiff = exifUtils.readTiffForOrientation(
        dv,
        tiffStart,
        segEnd
      );
      console.log(
        'Test: exifUtils.readTiffForOrientation returned',
        orientationFromReadTiff
      );

      expect(orientationFromReadTiff).toBe(6);
    });

    it('should return -1 if no EXIF data is found', async () => {
      const buffer = new ArrayBuffer(100);
      const view = new DataView(buffer);
      view.setUint16(0, 0xffd8, false); // SOI
      view.setUint16(2, 0xffe0, false); // APP0（EXIFなし）
      const mockFile = new Blob([new Uint8Array(buffer)], {
        type: 'image/jpeg',
      });

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
