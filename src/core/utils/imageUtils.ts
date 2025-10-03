export async function saveImageWithRetry(
  imageBlob: Blob,
  fileName: string,
  saveFunction: (blob: Blob, name: string) => Promise<void>,
  reduceQuality?: (blob: Blob) => Blob,
  reduceResolution?: (blob: Blob) => Blob
): Promise<void> {
  try {
    await saveFunction(imageBlob, fileName);
    return;
  } catch (error) {
    console.warn(
      'Image save failed, attempting retry with reduced quality:',
      error
    );
  }

  if (reduceQuality) {
    try {
      const reducedQualityBlob = reduceQuality(imageBlob);
      await saveFunction(reducedQualityBlob, fileName);
      return;
    } catch (error) {
      console.warn(
        'Image save with reduced quality failed, attempting retry with reduced resolution:',
        error
      );
    }
  }

  if (reduceResolution) {
    try {
      const reducedResolutionBlob = reduceResolution(imageBlob);
      await saveFunction(reducedResolutionBlob, fileName);
      return;
    } catch (error) {
      console.error(
        'Image save with reduced resolution failed, giving up:',
        error
      );
      throw error;
    }
  }

  throw new Error('Image save failed after all retries.');
}
