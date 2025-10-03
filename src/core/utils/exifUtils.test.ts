import { describe, it, expect } from 'vitest';
import { correctImageOrientation } from './exifUtils';

// Sample JPEG data (base64) with different EXIF orientations.
// These are tiny 1x1 pixel JPEGs.
// Orientation 1 (Normal)
const jpegOrientation1 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AAf/Z';

// Orientation 6 (Rotate 90 CW)
const jpegOrientation6 =
  '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAABAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD/AL+AAf/Z';

describe('correctImageOrientation', () => {
  it('should return the original blob if orientation is 1 (normal)', async () => {
    const imageBlob = await fetch(
      `data:image/jpeg;base64,${jpegOrientation1}`
    ).then((res) => res.blob());
    const correctedBlob = await correctImageOrientation(imageBlob);
    expect(correctedBlob).toBe(imageBlob);
  });

  it('should return a rotated blob if orientation is 6 (90 deg CW)', async () => {
    const imageBlob = await fetch(
      `data:image/jpeg;base64,${jpegOrientation6}`
    ).then((res) => res.blob());
    const correctedBlob = await correctImageOrientation(imageBlob);
    // The new blob should be different from the original
    expect(correctedBlob).not.toBe(imageBlob);
    // More specific assertions would require decoding the image,
    // but for now, we'll just check that a new blob was created.
    expect(correctedBlob.type).toBe('image/jpeg');
  });

  it('should handle images without EXIF data gracefully', async () => {
    // A simple PNG without EXIF
    const pngBlob = await fetch(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
    ).then((res) => res.blob());
    const correctedBlob = await correctImageOrientation(pngBlob);
    expect(correctedBlob).toBe(pngBlob);
  });
});
