/**
 * Calculates the perceived brightness of an RGB color and returns either black or white
 * for the best contrast.
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns '#000000' for black or '#FFFFFF' for white.
 */
export const getContrastTextColor = (
  r: number,
  g: number,
  b: number
): string => {
  // Formula from http://www.w3.org/TR/AERT#color-contrast
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness >= 128 ? '#000000' : '#FFFFFF';
};

/**
 * Analyzes a region of an image to determine the optimal text color (black or white)
 * for readability against the background.
 * @param imageData - The ImageData object for the region.
 * @returns '#000000' for black or '#FFFFFF' for white.
 */
export const getOptimalTextColorForRegion = (imageData: ImageData): string => {
  const data = imageData.data;
  let totalBrightness = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Using the same W3C formula for consistency
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    totalBrightness += brightness;
  }

  const avgBrightness = totalBrightness / pixelCount;

  return avgBrightness >= 128 ? '#000000' : '#FFFFFF';
};
