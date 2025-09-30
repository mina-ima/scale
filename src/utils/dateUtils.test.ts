import { describe, it, expect } from 'vitest';
import {
  toISOStringWithTimezone,
  parseISOStringToLocalDate,
} from './dateUtils';

describe('dateUtils', () => {
  it('should convert a local date to ISO string with timezone', () => {
    const date = new Date(2023, 0, 1, 10, 30, 0); // January 1, 2023, 10:30:00
    const isoString = toISOStringWithTimezone(date);
    // The exact ISO string depends on the timezone where the test is run,
    // so we'll check the format and key components.
    expect(isoString).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}[+-]\d{2}:\d{2}$/
    );
    expect(isoString).toContain('2023-01-01');
    expect(isoString).toContain('10:30:00');
  });

  it('should parse an ISO string to a local date', () => {
    const isoString = '2023-01-01T10:30:00.000+09:00'; // Example ISO string with timezone
    const localDate = parseISOStringToLocalDate(isoString);
    expect(localDate.getFullYear()).toBe(2023);
    expect(localDate.getMonth()).toBe(0); // January is 0
    expect(localDate.getDate()).toBe(1);
    expect(localDate.getHours()).toBe(10); // This might vary based on local timezone offset
    expect(localDate.getMinutes()).toBe(30);
    expect(localDate.getSeconds()).toBe(0);
  });

  it('should handle invalid ISO string gracefully when parsing', () => {
    const invalidIsoString = 'invalid-date-string';
    const localDate = parseISOStringToLocalDate(invalidIsoString);
    expect(isNaN(localDate.getTime())).toBe(true);
  });
});
