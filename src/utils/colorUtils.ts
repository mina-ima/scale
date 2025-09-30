export const getContrastTextColor = (
  r: number,
  g: number,
  b: number
): string => {
  // Calculate luminance using the standard formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Use a threshold to determine whether to return black or white
  // A common threshold is 0.5 (for luminance normalized to 0-1)
  // or 128 (for luminance normalized to 0-255)
  const threshold = 0.5;

  if (luminance > threshold) {
    return '#000000'; // Light background, return black text
  } else {
    return '#FFFFFF'; // Dark background, return white text
  }
};
