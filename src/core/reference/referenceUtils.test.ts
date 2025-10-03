import { getReferenceObjectDetectionMessage } from './referenceUtils';

describe('getReferenceObjectDetectionMessage', () => {
  it('should return null if a reference object is detected', () => {
    expect(getReferenceObjectDetectionMessage(true)).toBeNull();
  });

  it('should return a message if no reference object is detected', () => {
    expect(getReferenceObjectDetectionMessage(false)).toBe(
      '基準物を検出できませんでした。A4用紙などを画面内に収めてください。'
    );
  });
});
