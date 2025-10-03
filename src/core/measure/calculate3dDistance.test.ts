import { calculate3dDistance } from './calculate3dDistance';

describe('calculate3dDistance', () => {
  it('should return 0 for the same point', () => {
    const p1 = { x: 1, y: 2, z: 3 };
    const p2 = { x: 1, y: 2, z: 3 };
    expect(calculate3dDistance(p1, p2)).toBe(0);
  });

  it('should calculate the distance correctly along a single axis', () => {
    const p1 = { x: 1, y: 2, z: 3 };
    const p2 = { x: 5, y: 2, z: 3 };
    expect(calculate3dDistance(p1, p2)).toBe(4);
  });

  it('should calculate the distance correctly in 3D space', () => {
    const p1 = { x: 1, y: 1, z: 1 };
    const p2 = { x: 2, y: 2, z: 2 };
    // sqrt((2-1)^2 + (2-1)^2 + (2-1)^2) = sqrt(1+1+1) = sqrt(3)
    expect(calculate3dDistance(p1, p2)).toBeCloseTo(Math.sqrt(3));
  });

  it('should handle negative coordinates', () => {
    const p1 = { x: -1, y: -1, z: -1 };
    const p2 = { x: -2, y: -2, z: -2 };
    expect(calculate3dDistance(p1, p2)).toBeCloseTo(Math.sqrt(3));
  });
});
