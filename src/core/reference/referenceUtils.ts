export function getReferenceObjectDetectionMessage(isDetected: boolean): string | null {
  if (isDetected) {
    return null;
  }
  return '基準物を検出できませんでした。A4用紙などを画面内に収めてください。';
}
