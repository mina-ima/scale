import { DetectedRectangle } from './ShapeDetection';
import { ReferenceObject } from './ReferenceObject';

export interface ScaleEstimationResult {
  mmPerPx: number;
  confidence: number; // 0 to 1, higher is better
  matchedReferenceObject: ReferenceObject | null;
  matchedDetectedRectangle: DetectedRectangle | null;
}

export const estimateScale = (
  detectedRectangles: DetectedRectangle[],
  referenceObjects: ReferenceObject[]
): ScaleEstimationResult => {
  let bestResult: ScaleEstimationResult = {
    mmPerPx: 0,
    confidence: 0,
    matchedReferenceObject: null,
    matchedDetectedRectangle: null,
  };

  if (detectedRectangles.length === 0 || referenceObjects.length === 0) {
    return bestResult;
  }

  for (const detectedRect of detectedRectangles) {
    for (const refObject of referenceObjects) {
      // Calculate scale based on width and height
      const scaleX = refObject.widthMm / detectedRect.width;
      const scaleY = refObject.heightMm / detectedRect.height;

      // Calculate aspect ratio match confidence
      const refAspectRatio = refObject.widthMm / refObject.heightMm;
      const detectedAspectRatio = detectedRect.width / detectedRect.height;

      // How close are the aspect ratios?
      const aspectRatioDiff = Math.abs(refAspectRatio - detectedAspectRatio);
      const aspectRatioConfidence =
        1 - aspectRatioDiff / Math.max(refAspectRatio, detectedAspectRatio);

      // How close are scaleX and scaleY?
      const scaleDiff = Math.abs(scaleX - scaleY);
      const scaleConsistencyConfidence =
        1 - scaleDiff / Math.max(scaleX, scaleY);

      // Combine confidences (simple average for now)
      // We also need to consider the overall scale value. If scaleX or scaleY is very small or very large, it might be a bad match.
      // For now, let's focus on aspect ratio and scale consistency.
      const currentConfidence =
        (aspectRatioConfidence + scaleConsistencyConfidence) / 2;

      // If this is a better match, update bestResult
      if (currentConfidence > bestResult.confidence) {
        bestResult = {
          mmPerPx: (scaleX + scaleY) / 2, // Average scale
          confidence: currentConfidence,
          matchedReferenceObject: refObject,
          matchedDetectedRectangle: detectedRect,
        };
      }
    }
  }

  return bestResult;
};
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.7; // Example threshold

export const shouldConfirmScaleEstimation = (
  result: ScaleEstimationResult,
  threshold: number = DEFAULT_CONFIDENCE_THRESHOLD
): boolean => {
  // Placeholder implementation
  return result.confidence < threshold;
};

export const getScaleEstimationHint = (
  result: ScaleEstimationResult,
  needsConfirmation: boolean
): string => {
  if (needsConfirmation) {
    if (result.matchedReferenceObject === null) {
      return '基準物が検出されませんでした。A4用紙やクレジットカードなどを画面内に収めてください。';
    } else {
      return `「${result.matchedReferenceObject.name}」が検出されましたが、精度が低い可能性があります。再撮影しますか？`;
    }
  } else if (result.mmPerPx === 0) {
    return 'スケールを推定できませんでした。基準物を画面内に収めてください。';
  }
  return ''; // No hint needed if confident and valid
};
