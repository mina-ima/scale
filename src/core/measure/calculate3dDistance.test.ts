import { calculate3dDistance, Point3D } from './calculate3dDistance';

describe('calculate3dDistance', () => {
  it('should calculate the 3D distance between two points correctly', () => {
    const p1: Point3D = { x: 0, y: 0, z: 0 };
    const p2: Point3D = { x: 3, y: 4, z: 0 }; // 2D distance of 5
    expect(calculate3dDistance(p1, p2)).toBe(5);
  });

  it('should calculate the 3D distance with z-component correctly', () => {
    const p1: Point3D = { x: 0, y: 0, z: 0 };
    const p2: Point3D = { x: 3, y: 4, z: 12 }; // sqrt(9 + 16 + 144) = sqrt(169) = 13
    expect(calculate3dDistance(p1, p2)).toBe(13);
  });

  it('should return 0 if the points are identical', () => {
    const p1: Point3D = { x: 1, y: 2, z: 3 };
    const p2: Point3D = { x: 1, y: 2, z: 3 };
    expect(calculate3dDistance(p1, p2)).toBe(0);
  });

  it('should handle negative coordinates correctly', () => {
    const p1: Point3D = { x: -1, y: -1, z: -1 };
    const p2: Point3D = { x: -4, y: -5, z: -13 }; // sqrt((-3)^2 + (-4)^2 + (-12)^2) = sqrt(9 + 16 + 144) = sqrt(169) = 13
    expect(calculate3dDistance(p1, p2)).toBe(13);
  });
});
