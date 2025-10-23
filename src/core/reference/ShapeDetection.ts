import { Point } from '../fallback/utils';
import { ReferenceObject } from './ReferenceObject';

export interface DetectedRectangle {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
  width: number;
  height: number;
  aspectRatio: number; // width / height
}

export interface DetectedCircle {
  center: Point;
  radius: number;
}

import { cv, Mat } from 'opencv-ts';

// Shape detection function implemented with OpenCV-ts
export const detectShapes = (
  image: Mat
): {
  rectangles: DetectedRectangle[];
  circles: DetectedCircle[];
} => {
  const gray = new cv.Mat();
  cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);

  const blurred = new cv.Mat();
  cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

  const edged = new cv.Mat();
  cv.Canny(blurred, edged, 50, 150); // Adjusted thresholds for better detection

  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(
    edged,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  const detectedRectangles: DetectedRectangle[] = [];

  for (let i = 0; i < contours.size(); ++i) {
    const c = contours.get(i);
    const peri = cv.arcLength(c, true);
    const approx = new cv.Mat();
    cv.approxPolyDP(c, approx, 0.04 * peri, true);

    // Check if the approximated contour has 4 vertices and is convex
    if (approx.rows === 4 && cv.isContourConvex(approx)) {
      const points: Point[] = [];
      for (let j = 0; j < approx.rows; j++) {
        points.push({ x: approx.data32S[j * 2], y: approx.data32S[j * 2 + 1] });
      }

      // Sort points to be in clockwise order: top-left, top-right, bottom-right, bottom-left
      const rect = cv.boundingRect(c);
      
      // Find the top-left point to start the array.
      // A point is "more top-left" if it has a smaller sum of x and y.
      const topLeftIndex = points.reduce((bestIndex, currentPoint, currentIndex, arr) => {
        const bestPoint = arr[bestIndex];
        if (currentPoint.x + currentPoint.y < bestPoint.x + bestPoint.y) {
          return currentIndex;
        }
        return bestIndex;
      }, 0);

      const finalPoints = [
        ...points.slice(topLeftIndex),
        ...points.slice(0, topLeftIndex),
      ];
      
      const [tl, tr, br, bl] = finalPoints;

      detectedRectangles.push({
        topLeft: tl,
        topRight: tr,
        bottomRight: br,
        bottomLeft: bl,
        width: rect.width,
        height: rect.height,
        aspectRatio: rect.width / rect.height,
      });
    }
    c.delete();
    approx.delete();
  }

  // Memory cleanup
  gray.delete();
  blurred.delete();
  edged.delete();
  contours.delete();
  hierarchy.delete();

  return { rectangles: detectedRectangles, circles: [] };
};

export const filterRectanglesByReference = (
  rectangles: DetectedRectangle[],
  reference: ReferenceObject,
  tolerance = 0.1 // 10% tolerance for aspect ratio
): DetectedRectangle[] => {
  // 基準オブジェクトのアスペクト比（横長）
  const aspect1 = reference.widthMm / reference.heightMm;
  // 基準オブジェクトのアスペクト比（縦長）
  const aspect2 = reference.heightMm / reference.widthMm;

  return rectangles.filter((rect) => {
    const rectAspect = rect.aspectRatio;

    // 横長（aspect1）との差が許容範囲内か
    const diff1 = Math.abs(rectAspect - aspect1);
    if (diff1 <= aspect1 * tolerance) {
      return true;
    }

    // 縦長（aspect2）との差が許容範囲内か
    const diff2 = Math.abs(rectAspect - aspect2);
    if (diff2 <= aspect2 * tolerance) {
      return true;
    }

    return false;
  });
};
