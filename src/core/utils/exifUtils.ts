/**
 * Parses a JPEG file blob to extract the EXIF orientation value.
 * @param file The image blob.
 * @returns A promise that resolves with the orientation number (1-8) or -1 if not found.
 */
export function getOrientation(file: Blob): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      if (!event.target?.result) {
        resolve(-1);
        return;
      }

      const view = new DataView(event.target.result as ArrayBuffer);

      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(-1); // Not a valid JPEG
        return;
      }

      const length = view.byteLength;
      let offset = 2;

      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            resolve(-1); // No EXIF header
            return;
          }
          const tiffOffset = offset + 6;
          const little = view.getUint16(tiffOffset, true) === 0x4949;
          offset += view.getUint32(tiffOffset + 4, little);

          const tags = view.getUint16(offset, little);
          offset += 2;

          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little));
              return;
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break;
        }
        offset += view.getUint16(offset, false);
      }
      resolve(-1); // Orientation tag not found
    };

    reader.onerror = () => resolve(-1);

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Given an image blob, checks the EXIF orientation and rotates the image
 * to be upright if necessary.
 * @param imageBlob The image blob to process.
 * @returns A promise that resolves with the corrected image blob.
 */
export async function correctImageOrientation(imageBlob: Blob): Promise<Blob> {
  const orientation = await getOrientation(imageBlob);

  if (orientation <= 1) {
    return imageBlob; // No rotation needed or orientation not found
  }

  const imageBitmap = await createImageBitmap(imageBlob);
  const { width, height } = imageBitmap;

  let canvasWidth = width;
  let canvasHeight = height;

  // Swap dimensions for orientations 5-8
  if (orientation >= 5) {
    [canvasWidth, canvasHeight] = [canvasHeight, canvasWidth];
  }

  const canvas = new OffscreenCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return imageBlob; // Return original if context cannot be created
  }

  // Apply transformations based on orientation
  switch (orientation) {
    case 2: // horizontal flip
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
      break;
    case 3: // 180° rotate left
      ctx.translate(width, height);
      ctx.rotate(Math.PI);
      break;
    case 4: // vertical flip
      ctx.translate(0, height);
      ctx.scale(1, -1);
      break;
    case 5: // vertical flip + 90° rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      break;
    case 6: // 90° rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -height);
      break;
    case 7: // horizontal flip + 90° rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(width, -height);
      ctx.scale(-1, 1);
      break;
    case 8: // 90° rotate left
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-width, 0);
      break;
  }

  ctx.drawImage(imageBitmap, 0, 0);

  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.95 });
}
