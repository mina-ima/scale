import {
  estimateScale,
  ScaleEstimationResult,
  shouldConfirmScaleEstimation,
  getScaleEstimationHint,
} from './ScaleEstimation';
import { DetectedRectangle } from './ShapeDetection';
import { A4_PAPER, CREDIT_CARD, REFERENCE_OBJECTS } from './ReferenceObject';

describe('estimateScale', () => {
  it('should return a default ScaleEstimationResult when no rectangles are provided', () => {
    const detectedRectangles: DetectedRectangle[] = [];
    const result = estimateScale(detectedRectangles, REFERENCE_OBJECTS);

    expect(result).toEqual({
      mmPerPx: 0,
      confidence: 0,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    });
  });

  it('should return a default ScaleEstimationResult when no reference objects are provided', () => {
    const detectedRectangles: DetectedRectangle[] = [
      {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 100, y: 0 },
        bottomRight: { x: 100, y: 50 },
        bottomLeft: { x: 0, y: 50 },
        width: 100,
        height: 50,
        aspectRatio: 2,
      },
    ];
    const result = estimateScale(detectedRectangles, []);

    expect(result).toEqual({
      mmPerPx: 0,
      confidence: 0,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    });
  });

  // Test case for a perfect match with A4 paper
  it('should correctly estimate scale and confidence for a perfect A4 match', () => {
    const detectedRectangles: DetectedRectangle[] = [
      {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 210, y: 0 },
        bottomRight: { x: 210, y: 297 },
        bottomLeft: { x: 0, y: 297 },
        width: 210,
        height: 297,
        aspectRatio: 210 / 297,
      },
    ];
    const result = estimateScale(detectedRectangles, [A4_PAPER]);

    // These expectations will fail with the placeholder, but define the desired behavior
    expect(result.mmPerPx).toBeCloseTo(1); // 1mm per pixel
    expect(result.confidence).toBe(1); // Perfect match
    expect(result.matchedReferenceObject).toEqual(A4_PAPER);
    expect(result.matchedDetectedRectangle).toEqual(detectedRectangles[0]);
  });

  // Test case for a perfect match with Credit Card
  it('should correctly estimate scale and confidence for a perfect Credit Card match', () => {
    const detectedRectangles: DetectedRectangle[] = [
      {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 85.6, y: 0 },
        bottomRight: { x: 85.6, y: 53.98 },
        bottomLeft: { x: 0, y: 53.98 },
        width: 85.6,
        height: 53.98,
        aspectRatio: 85.6 / 53.98,
      },
    ];
    const result = estimateScale(detectedRectangles, [CREDIT_CARD]);

    // These expectations will fail with the placeholder, but define the desired behavior
    expect(result.mmPerPx).toBeCloseTo(1); // 1mm per pixel
    expect(result.confidence).toBe(1); // Perfect match
    expect(result.matchedReferenceObject).toEqual(CREDIT_CARD);
    expect(result.matchedDetectedRectangle).toEqual(detectedRectangles[0]);
  });

  // Test case for a near match with A4 paper (e.g., slightly off aspect ratio or size)
  it('should estimate scale and confidence for a near A4 match', () => {
    const detectedRectangles: DetectedRectangle[] = [
      {
        topLeft: { x: 0, y: 0 },
        topRight: { x: 200, y: 0 },
        bottomRight: { x: 200, y: 280 },
        bottomLeft: { x: 0, y: 280 },
        width: 200,
        height: 280,
        aspectRatio: 200 / 280,
      },
    ];
    const result = estimateScale(detectedRectangles, [A4_PAPER]);

    // These expectations will fail with the placeholder, but define the desired behavior
    expect(result.mmPerPx).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.confidence).toBeLessThan(1);
    expect(result.matchedReferenceObject).toEqual(A4_PAPER);
    expect(result.matchedDetectedRectangle).toEqual(detectedRectangles[0]);
  });
});

describe('shouldConfirmScaleEstimation', () => {
  it('should return true if confidence is below the threshold', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.6,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(shouldConfirmScaleEstimation(result, 0.7)).toBe(true);
  });

  it('should return false if confidence is at or above the threshold', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.7,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(shouldConfirmScaleEstimation(result, 0.7)).toBe(false);

    const result2: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.8,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(shouldConfirmScaleEstimation(result2, 0.7)).toBe(false);
  });

  it('should use the default threshold if none is provided', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.6, // Below default 0.7
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(shouldConfirmScaleEstimation(result)).toBe(true);

    const result2: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.7, // At default 0.7
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(shouldConfirmScaleEstimation(result2)).toBe(false);
  });
});

describe('getScaleEstimationHint', () => {
  it('should return a hint for no reference object detected when confirmation is needed', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 0,
      confidence: 0,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, true)).toBe(
      '基準物が検出されませんでした。A4用紙やクレジットカードなどを画面内に収めてください。'
    );
  });

  it('should return a hint for low confidence with a matched object when confirmation is needed', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.6,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, true)).toBe(
      '「A4 Paper」が検出されましたが、精度が低い可能性があります。再撮影しますか？'
    );
  });

  it('should return a hint for no scale estimation when no confirmation is needed but mmPerPx is 0', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 0,
      confidence: 0.8, // High confidence but mmPerPx is 0 (e.g., no detected rects)
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, false)).toBe(
      'スケールを推定できませんでした。基準物を画面内に収めてください。'
    );
  });

  it('should return an empty string if no hint is needed', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.8,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, false)).toBe('');
  });
});

describe('getScaleEstimationHint', () => {
  it('should return a hint for no reference object detected when confirmation is needed', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 0,
      confidence: 0,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, true)).toBe(
      '基準物が検出されませんでした。A4用紙やクレジットカードなどを画面内に収めてください。'
    );
  });

  it('should return a hint for low confidence with a matched object when confirmation is needed', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.6,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, true)).toBe(
      '「A4 Paper」が検出されましたが、精度が低い可能性があります。再撮影しますか？'
    );
  });

  it('should return a hint for no scale estimation when no confirmation is needed but mmPerPx is 0', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 0,
      confidence: 0.8, // High confidence but mmPerPx is 0 (e.g., no detected rects)
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, false)).toBe(
      'スケールを推定できませんでした。基準物を画面内に収めてください。'
    );
  });

  it('should return an empty string if no hint is needed', () => {
    const result: ScaleEstimationResult = {
      mmPerPx: 1,
      confidence: 0.8,
      matchedReferenceObject: A4_PAPER,
      matchedDetectedRectangle: null,
    };
    expect(getScaleEstimationHint(result, false)).toBe('');
  });
});
