import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import {
  getContrastTextColor,
  getOptimalTextColorForRegion,
} from './colorUtils';

// Mock ImageData for Node.js environment
const mockImageData = class {
  data: Uint8ClampedArray;
  width: number;
  height: number;

  constructor(data: Uint8ClampedArray, width: number, height: number) {
    this.data = data;
    this.width = width;
    this.height = height;
  }
};

describe('colorUtils', () => {
  beforeAll(() => {
    vi.stubGlobal('ImageData', mockImageData);
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  describe('getContrastTextColor', () => {
    it('should return white for dark background colors', () => {
      // Dark red
      expect(getContrastTextColor(0, 0, 0)).toBe('#FFFFFF');
      expect(getContrastTextColor(10, 10, 10)).toBe('#FFFFFF');
      expect(getContrastTextColor(50, 0, 0)).toBe('#FFFFFF');
      expect(getContrastTextColor(0, 50, 0)).toBe('#FFFFFF');
      expect(getContrastTextColor(0, 0, 50)).toBe('#FFFFFF');
    });

    it('should return black for light background colors', () => {
      // Light blue
      expect(getContrastTextColor(255, 255, 255)).toBe('#000000');
      expect(getContrastTextColor(200, 200, 200)).toBe('#000000');
      expect(getContrastTextColor(255, 255, 0)).toBe('#000000');
      expect(getContrastTextColor(0, 255, 255)).toBe('#000000');
      expect(getContrastTextColor(255, 0, 255)).toBe('#FFFFFF');
    });

    it('should handle edge cases around the threshold', () => {
      // Assuming a threshold around 128 for luminance
      // These values might need adjustment based on the exact luminance formula and threshold
      // For now, let's use a simple threshold for testing purposes.
      // A color that is just below the threshold should be white
      expect(getContrastTextColor(120, 120, 120)).toBe('#FFFFFF');
      // A color that is just above the threshold should be black
      expect(getContrastTextColor(140, 140, 140)).toBe('#000000');
    });
  });

  describe('getOptimalTextColorForRegion', () => {
    it('should return white for a dark region', () => {
      // 2x2 dark gray region
      const darkImageData = new ImageData(
        new Uint8ClampedArray([
          50, 50, 50, 255, 50, 50, 50, 255, 50, 50, 50, 255, 50, 50, 50, 255,
        ]),
        2,
        2
      );
      expect(getOptimalTextColorForRegion(darkImageData)).toBe('#FFFFFF');
    });

    it('should return black for a light region', () => {
      // 2x2 light gray region
      const lightImageData = new ImageData(
        new Uint8ClampedArray([
          200, 200, 200, 255, 200, 200, 200, 255, 200, 200, 200, 255, 200, 200,
          200, 255,
        ]),
        2,
        2
      );
      expect(getOptimalTextColorForRegion(lightImageData)).toBe('#000000');
    });

    it('should return black for a medium-gray region (tie-breaking)', () => {
      // 2x2 medium gray region, right on the threshold
      const mediumImageData = new ImageData(
        new Uint8ClampedArray([
          128, 128, 128, 255, 128, 128, 128, 255, 128, 128, 128, 255, 128, 128,
          128, 255,
        ]),
        2,
        2
      );
      expect(getOptimalTextColorForRegion(mediumImageData)).toBe('#000000');
    });
  });
});
