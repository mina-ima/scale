import { DetectedRectangle } from './ShapeDetection';
import { ReferenceObject } from './ReferenceObject';

export interface ScaleEstimation {
  mmPerPx: number;
  confidence: number; // 0..1
  matchedReferenceObject: ReferenceObject | null;
  matchedDetectedRectangle: DetectedRectangle | null;
}

// --- Safety helpers ---
function isPositiveFinite(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export const estimateScale = (
  detectedRectangles: DetectedRectangle[],
  referenceObjects: ReferenceObject[]
): ScaleEstimation => {
  let bestResult: ScaleEstimation = {
    mmPerPx: 0,
    confidence: 0,
    matchedReferenceObject: null,
    matchedDetectedRectangle: null,
  };

  // 入力が空なら既定の空結果
  if (detectedRectangles.length === 0 || referenceObjects.length === 0) {
    return bestResult;
  }

  for (const detectedRect of detectedRectangles) {
    // 検出矩形の基本チェック
    if (
      !isPositiveFinite(detectedRect.width) ||
      !isPositiveFinite(detectedRect.height)
    ) {
      continue;
    }

    for (const refObject of referenceObjects) {
      // 参照物の基本チェック
      if (
        !isPositiveFinite(refObject.widthMm) ||
        !isPositiveFinite(refObject.heightMm)
      ) {
        continue;
      }

      // === スケール推定 ===
      const scaleX = refObject.widthMm / detectedRect.width;
      const scaleY = refObject.heightMm / detectedRect.height;

      if (!isPositiveFinite(scaleX) || !isPositiveFinite(scaleY)) {
        continue; // ゼロ割/非数は不採用
      }

      // === アスペクト比 ===
      const refAspectRatio = refObject.widthMm / refObject.heightMm;
      const detectedAspectRatio = detectedRect.width / detectedRect.height;
      if (!isPositiveFinite(refAspectRatio) || !isPositiveFinite(detectedAspectRatio)) {
        continue;
      }

      const aspectRatioDiff = Math.abs(refAspectRatio - detectedAspectRatio);
      const aspectRatioDen = Math.max(refAspectRatio, detectedAspectRatio);
      const aspectRatioConfidence = clamp01(1 - aspectRatioDiff / aspectRatioDen);

      // === スケール一貫性 ===
      const scaleDiff = Math.abs(scaleX - scaleY);
      const scaleDen = Math.max(scaleX, scaleY);
      const scaleConsistencyConfidence = clamp01(1 - scaleDiff / scaleDen);

      // === 信頼度（単純平均、0..1へクランプ） ===
      const currentConfidence = clamp01(
        (aspectRatioConfidence + scaleConsistencyConfidence) / 2
      );

      // === mmPerPx（正規化 & チェック） ===
      const mmPerPx = (scaleX + scaleY) / 2;
      if (!isPositiveFinite(mmPerPx)) {
        continue;
      }

      // より良い一致なら採用
      if (currentConfidence > bestResult.confidence) {
        bestResult = {
          mmPerPx,
          confidence: currentConfidence,
          matchedReferenceObject: refObject,
          matchedDetectedRectangle: detectedRect,
        };
      }
    }
  }

  return bestResult;
};

export const DEFAULT_CONFIDENCE_THRESHOLD = 0.7; // 既定しきい値

export const shouldConfirmScaleEstimation = (
  result: ScaleEstimation,
  threshold: number = DEFAULT_CONFIDENCE_THRESHOLD
): boolean => {
  // 単純基準：信頼度がしきい値未満ならユーザー確認
  return result.confidence < threshold;
};

export const getScaleEstimationHint = (
  result: ScaleEstimation,
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
  return ''; // 問題なし
};
