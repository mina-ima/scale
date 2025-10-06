interface Point {
  x: number;
  y: number;
}

/**
 * Calculates the 2D distance between two points and applies a scale factor.
 *
 * @param p1 The first point {x, y}.
 * @param p2 The second point {x, y}.
 * @param mmPerPx The scale factor in millimeters per pixel.
 * @returns The calculated distance in millimeters.
 */
export const calculate2dDistance = (
  p1: Point,
  p2: Point,
  mmPerPx: number
): number => {
  if (
    window.isPlaywrightTest &&
    typeof window.mockCalculate2dDistance === 'function'
  ) {
    return window.mockCalculate2dDistance(p1, p2, mmPerPx);
  }

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distancePx = Math.sqrt(dx * dx + dy * dy);
  return distancePx * mmPerPx;
};
