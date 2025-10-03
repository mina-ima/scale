import { getMeasurementHint } from './measurementHints';

describe('getMeasurementHint', () => {
  it('should return a hint for max distance in measurement mode', () => {
    const hint = getMeasurementHint('measurement', { distance: 11 });
    expect(hint).toBe('最大10mまで測定可能です');
  });

  it('should return a hint for reference object detection in fallback mode', () => {
    const hint = getMeasurementHint('fallback', {
      referenceObjectDetected: false,
    });
    expect(hint).toBe('A4や硬貨を一緒に映すと精度アップ！');
  });

  it('should return a hint for plane detection in AR mode', () => {
    const hint = getMeasurementHint('ar', { planeDetected: false });
    expect(hint).toBe('床や壁を映してください');
  });

  it('should return null if no specific hint is needed', () => {
    const hint = getMeasurementHint('measurement', { distance: 5 });
    expect(hint).toBeNull();

    const hint2 = getMeasurementHint('fallback', {
      referenceObjectDetected: true,
    });
    expect(hint2).toBeNull();

    const hint3 = getMeasurementHint('ar', { planeDetected: true });
    expect(hint3).toBeNull();
  });
});
