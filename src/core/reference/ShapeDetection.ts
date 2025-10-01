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

// Placeholder for shape detection function
export const detectShapes = (): {
  rectangles: DetectedRectangle[];
  circles: DetectedCircle[];
} => {
  // This will be implemented later, for now return empty arrays
  return { rectangles: [], circles: [] };
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
