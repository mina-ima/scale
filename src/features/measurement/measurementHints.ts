import { getPlaneDetectionMessage } from '../../core/ar/webxrUtils';

interface MeasurementHintOptions {
  distance?: number;
  referenceObjectDetected?: boolean;
  planeDetected?: boolean;
}

export function getMeasurementHint(
  mode: 'measurement' | 'fallback' | 'ar',
  options: MeasurementHintOptions
): string | null {
  if (mode === 'measurement' && options.distance && options.distance > 10) {
    return '最大10mまで測定可能です';
  }

  if (mode === 'fallback' && options.referenceObjectDetected === false) {
    return 'A4や硬貨を一緒に映すと精度アップ！';
  }

  if (mode === 'ar' && options.planeDetected === false) {
    return getPlaneDetectionMessage({
      detectedPlanes: {
        [Symbol.iterator]: () => ({ next: () => ({ done: true }) }),
      },
    } as unknown as XRFrame);
  }

  return null;
}
