import { describe, it, expect } from 'vitest';
import { getContrastTextColor } from './colorUtils';

describe('colorUtils', () => {
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
