import { describe, it, expect } from 'vitest';
import { isDistanceExceeded } from './maxDistanceGuard';

describe('isDistanceExceeded', () => {
  it('should return false for distance less than 10m', () => {
    expect(isDistanceExceeded(9999)).toBe(false); // 9.999m
  });

  it('should return false for distance exactly 10m', () => {
    expect(isDistanceExceeded(10000)).toBe(false); // 10.000m
  });

  it('should return true for distance greater than 10m', () => {
    expect(isDistanceExceeded(10001)).toBe(true); // 10.001m
  });

  it('should return false for negative distance', () => {
    expect(isDistanceExceeded(-100)).toBe(false);
  });

  it('should return false for zero distance', () => {
    expect(isDistanceExceeded(0)).toBe(false);
  });
});
