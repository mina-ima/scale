import { describe, it, expect } from 'vitest';
import { calculate2dDistance } from './calculate2dDistance';

describe('calculate2dDistance', () => {
  it('should calculate horizontal distance correctly with scale', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 100, y: 0 };
    const mmPerPx = 0.5; // 0.5 mm per pixel
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBe(50);
  });

  it('should calculate vertical distance correctly with scale', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 0, y: 200 };
    const mmPerPx = 0.5;
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBe(100);
  });

  it('should calculate diagonal distance correctly with scale', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 300, y: 400 }; // 300^2 + 400^2 = 90000 + 160000 = 250000, sqrt = 500
    const mmPerPx = 0.1;
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBe(50);
  });

  it('should handle zero distance', () => {
    const p1 = { x: 10, y: 10 };
    const p2 = { x: 10, y: 10 };
    const mmPerPx = 1;
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBe(0);
  });

  it('should handle negative coordinates', () => {
    const p1 = { x: -10, y: -20 };
    const p2 = { x: -100, y: -200 };
    const mmPerPx = 0.1;
    // dx = -10 - (-100) = 90
    // dy = -20 - (-200) = 180
    // distance = sqrt(90^2 + 180^2) = sqrt(8100 + 32400) = sqrt(40500) approx 201.246
    // scaled distance = 201.246 * 0.1 = 20.1246
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBeCloseTo(20.1246);
  });

  it('should handle large coordinates and small scale', () => {
    const p1 = { x: 1000, y: 1000 };
    const p2 = { x: 2000, y: 1000 };
    const mmPerPx = 0.01;
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBe(10);
  });
});
