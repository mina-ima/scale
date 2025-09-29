const MAX_DISTANCE_MM = 10 * 1000; // 10 meters in millimeters

/**
 * Checks if the given distance in millimeters exceeds the maximum allowed distance (10 meters).
 *
 * @param distanceMm The distance in millimeters.
 * @returns True if the distance exceeds 10m, false otherwise.
 */
export const isDistanceExceeded = (distanceMm: number): boolean => {
  return distanceMm > MAX_DISTANCE_MM;
};
