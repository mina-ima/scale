import { describe, it, expect } from 'vitest';
import { diffYMD, toFullYears } from './seniority';

describe('seniority calculations', () => {
  // Test cases for diffYMD
  it('should calculate difference in years, months, and days correctly', () => {
    const start = new Date('2020-01-15');
    const end = new Date('2023-05-20');
    const result = diffYMD(start, end);
    expect(result).toEqual({ years: 3, months: 4, days: 5 });
  });

  it('should handle same month, different day correctly', () => {
    const start = new Date('2020-01-15');
    const end = new Date('2020-01-20');
    const result = diffYMD(start, end);
    expect(result).toEqual({ years: 0, months: 0, days: 5 });
  });

  it('should handle different month, same day correctly', () => {
    const start = new Date('2020-01-15');
    const end = new Date('2020-02-15');
    const result = diffYMD(start, end);
    expect(result).toEqual({ years: 0, months: 1, days: 0 });
  });

  it('should handle leap year correctly (end date in leap year)', () => {
    const start = new Date('2020-02-28');
    const end = new Date('2021-03-01');
    const result = diffYMD(start, end);
    expect(result).toEqual({ years: 1, months: 0, days: 1 }); // 2020-02-28 to 2021-02-28 is 1 year, then 1 day to 2021-03-01
  });

  it('should handle leap year correctly (start date in leap year)', () => {
    const start = new Date('2020-02-29');
    const end = new Date('2021-02-28');
    const result = diffYMD(start, end);
    expect(result).toEqual({ years: 0, months: 11, days: 30 }); // 2020-02-29 to 2021-02-28 is 364 days
  });

  it('should throw error for future dates', () => {
    const start = new Date('2023-01-01');
    const end = new Date('2022-12-31');
    expect(() => diffYMD(start, end)).toThrow(
      'End date cannot be before start date.'
    );
  });

  // Test cases for toFullYears
  it('should return full years correctly', () => {
    expect(toFullYears({ years: 5, months: 6, days: 10 })).toBe(5);
    expect(toFullYears({ years: 0, months: 11, days: 30 })).toBe(0);
    expect(toFullYears({ years: 10, months: 0, days: 0 })).toBe(10);
  });
});
