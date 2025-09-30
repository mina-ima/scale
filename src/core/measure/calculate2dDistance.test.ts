import { calculate2dDistance } from './calculate2dDistance';

describe('calculate2dDistance', () => {
  it('should calculate the distance between two points correctly', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };
    expect(calculate2dDistance(p1, p2, 1)).toBe(5);
  });

  it('should return 0 if the points are identical', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 0, y: 0 };
    expect(calculate2dDistance(p1, p2, 1)).toBe(0);
  });

  it('should handle negative coordinates correctly', () => {
    const p1 = { x: -1, y: -1 };
    const p2 = { x: -4, y: -5 };
    expect(calculate2dDistance(p1, p2, 1)).toBe(5);
  });

  it('should apply the scale factor correctly', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 3, y: 4 };
    const mmPerPx = 10; // 10 mm per pixel
    expect(calculate2dDistance(p1, p2, mmPerPx)).toBe(50);
  });
});
