import { describe, it, expect } from 'vitest';
import { formatMeasurement } from './format';

describe('formatMeasurement', () => {
  it('should format millimeters to centimeters with one decimal place', () => {
    expect(formatMeasurement(1234, 'cm')).toBe('123.4 cm');
  });

  it('should format millimeters to meters with one decimal place', () => {
    expect(formatMeasurement(1234, 'm')).toBe('1.2 m');
  });

  it('should handle zero value', () => {
    expect(formatMeasurement(0, 'cm')).toBe('0.0 cm');
  });

  it('should round up correctly', () => {
    // 99.95cm should round to 100.0cm
    expect(formatMeasurement(999.5, 'cm')).toBe('100.0 cm');
  });

  it('should round down correctly', () => {
    expect(formatMeasurement(1234.4, 'cm')).toBe('123.4 cm');
  });

  it('should return an empty string for invalid units', () => {
    // @ts-expect-error: Intentionally passing an invalid unit to test error handling
    expect(formatMeasurement(1000, 'invalid_unit')).toBe('');
  });

  it('should handle negative numbers', () => {
    expect(formatMeasurement(-500, 'cm')).toBe('-50.0 cm');
  });

  it('should format values with more than one decimal place to one decimal place', () => {
    expect(formatMeasurement(763.08, 'cm')).toBe('76.3 cm'); // 763.08mm = 76.308cm
  });
});
