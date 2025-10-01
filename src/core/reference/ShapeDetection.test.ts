import {
  DetectedRectangle,
  DetectedCircle,
  detectShapes,
  filterRectanglesByReference,
} from './ShapeDetection';
import { A4_PAPER, ReferenceObject } from './ReferenceObject';

describe('ShapeDetection', () => {
  describe('Interfaces and Placeholders', () => {
    it('DetectedRectangle interface should be well-defined', () => {
      const rect: DetectedRectangle = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 100, y: 0 },
        bottomRight: { x: 100, y: 50 },
        bottomLeft: { x: 0, y: 50 },
        width: 100,
        height: 50,
        aspectRatio: 2,
      };
      expect(rect).toBeDefined();
      expect(rect.width).toBe(100);
    });

    it('DetectedCircle interface should be well-defined', () => {
      const circle: DetectedCircle = {
        center: { x: 50, y: 50 },
        radius: 25,
      };
      expect(circle).toBeDefined();
      expect(circle.radius).toBe(25);
    });

    it('detectShapes should return empty arrays initially', () => {
      const result = detectShapes();
      expect(result.rectangles).toEqual([]);
      expect(result.circles).toEqual([]);
    });
  });

  describe('filterRectanglesByReference', () => {
    const reference: ReferenceObject = A4_PAPER; // 297mm / 210mm = 1.414
    const tolerance = 0.1; // 10%

    it('should return an empty array if no rectangles are provided', () => {
      const result = filterRectanglesByReference([], reference, tolerance);
      expect(result).toEqual([]);
    });

    it('should filter rectangles based on aspect ratio within tolerance', () => {
      const rectInsideTolerance: DetectedRectangle = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 145, y: 0 },
        bottomRight: { x: 145, y: 100 },
        bottomLeft: { x: 0, y: 100 },
        width: 145,
        height: 100,
        aspectRatio: 1.45, // 1.414 * (1 + 0.025) -> within 10% tolerance
      };
      const result = filterRectanglesByReference(
        [rectInsideTolerance],
        reference,
        tolerance
      );
      expect(result).toEqual([rectInsideTolerance]);
    });

    it('should not return rectangles with aspect ratio outside of tolerance', () => {
      const rectOutsideTolerance: DetectedRectangle = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 160, y: 0 },
        bottomRight: { x: 160, y: 100 },
        bottomLeft: { x: 0, y: 100 },
        width: 160,
        height: 100,
        aspectRatio: 1.6, // 1.414 * (1 + 0.13) -> outside 10% tolerance
      };
      const result = filterRectanglesByReference(
        [rectOutsideTolerance],
        reference,
        tolerance
      );
      expect(result).toEqual([]);
    });

    it('should handle both inside and outside tolerance rectangles', () => {
      const rectInsideTolerance: DetectedRectangle = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 140, y: 0 },
        bottomRight: { x: 140, y: 100 },
        bottomLeft: { x: 0, y: 100 },
        width: 140,
        height: 100,
        aspectRatio: 1.4, // close to 1.414
      };
      const rectOutsideTolerance: DetectedRectangle = {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 160, y: 0 },
        bottomRight: { x: 160, y: 100 },
        bottomLeft: { x: 0, y: 100 },
        width: 160,
        height: 100,
        aspectRatio: 1.6,
      };
      const result = filterRectanglesByReference(
        [rectInsideTolerance, rectOutsideTolerance],
        reference,
        tolerance
      );
      expect(result).toEqual([rectInsideTolerance]);
    });
  });
});
