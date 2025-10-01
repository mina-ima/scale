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

// Placeholder for filtering function
export const filterRectanglesByReference = (
  rectangles: DetectedRectangle[],
  reference: ReferenceObject,
  tolerance: number = 0.1 // 10% tolerance for aspect ratio
): DetectedRectangle[] => {
  const referenceAspectRatio = reference.widthMm / reference.heightMm;
  return rectangles.filter((rect) => {
    const rectAspectRatio = rect.width / rect.height;
    return (
      Math.abs(rectAspectRatio - referenceAspectRatio) <=
      referenceAspectRatio * tolerance
    );
  });
};
