import { describe, it, expect } from 'vitest';
import { generateFileName } from './fileUtils';

describe('generateFileName', () => {
  const date = new Date('2025-10-03T12:00:00Z');

  it('should generate a correct filename for height', () => {
    const expected = 'hakattake_2025-10-03_shinchou_123.4cm.jpg';
    const actual = generateFileName(
      'shinchou',
      123.4,
      'cm',
      date.toISOString() // Convert Date to ISO string
    );
    expect(actual).toBe(expected);
  });

  it('should generate a correct filename for foot size', () => {
    const expected = 'hakattake_2025-10-03_ashi_22.5cm.jpg';
    const actual = generateFileName('ashi', 22.5, 'cm', date.toISOString());
    expect(actual).toBe(expected);
  });

  it('should generate a correct filename for hand size', () => {
    const expected = 'hakattake_2025-10-03_te_15.0cm.jpg';
    const actual = generateFileName('te', 15.0, 'cm', date.toISOString());
    expect(actual).toBe(expected);
  });

  it('should generate a correct filename for weight', () => {
    const expected = 'hakattake_2025-10-03_taijuu_25.8kg.jpg';
    const actual = generateFileName('taijuu', 25.8, 'kg', date.toISOString());
    expect(actual).toBe(expected);
  });

  it('should pad month and day with zeros', () => {
    const earlyDate = new Date('2026-01-05T12:00:00Z');
    const expected = 'hakattake_2026-01-05_shinchou_130.0cm.jpg';
    const actual = generateFileName(
      'shinchou',
      130.0,
      'cm',
      earlyDate.toISOString()
    );
    expect(actual).toBe(expected);
  });
});
