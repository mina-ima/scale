/**
 * Converts a measurement in millimeters to the specified unit and formats it as a string with one decimal place.
 * The internal base unit is always millimeters (mm).
 *
 * @param valueMm The value in millimeters.
 * @param unit The target unit ('cm' or 'm').
 * @returns A formatted string (e.g., "123.4 cm") or an empty string if the unit is invalid.
 */
export const formatMeasurement = (
  valueMm: number,
  unit: 'cm' | 'm'
): string => {
  let convertedValue: number;

  switch (unit) {
    case 'cm':
      convertedValue = valueMm / 10;
      break;
    case 'm':
      convertedValue = valueMm / 1000;
      break;
    default:
      // Handle unexpected units gracefully
      return '';
  }

  // Round to one decimal place
  const roundedValue = Math.round(convertedValue * 10) / 10;

  // Format to always show one decimal place, e.g., 100.0
  const formattedValue = roundedValue.toFixed(1);

  return `${formattedValue} ${unit}`;
};
