// src/core/utils/exifUtils.ts

console.log(
  '[exifUtils] loaded from:',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any)?.url ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)?.__filename ??
    'unknown'
);

// ---- utils --------------------------------------------------------------

async function toArrayBuffer(
  input: Blob | ArrayBuffer | ArrayBufferView | Buffer
): Promise<ArrayBuffer> {
  if (input instanceof Blob || input instanceof File)
    return await input.arrayBuffer(); // Blob/File
  if (input instanceof ArrayBuffer) return input;
  if (ArrayBuffer.isView(input)) {
    const u8 = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    return u8.slice().buffer;
  }
  if (
    typeof Buffer !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).Buffer.isBuffer(input)
  ) {
    return (input as Buffer).slice().buffer; // Convert Buffer to a plain ArrayBuffer
  }
  throw new TypeError('Unsupported input for toArrayBuffer');
}
export const isValidOrient = (v: number) => v >= 1 && v <= 8;

// ---- main: getOrientation -----------------------------------------------

export async function getOrientation(file: Blob): Promise<number> {
  try {
    const buf = await toArrayBuffer(file);
    const dv = new DataView(buf);
    const len = dv.byteLength;

    // SOI
    if (len < 4 || dv.getUint16(0, false) !== 0xffd8) return -1;

    let off = 2;
    while (off + 4 <= len) {
      const marker = dv.getUint16(off, false);
      off += 2;

      if (marker === 0xffda) break; // SOS -> 以降は画像データ
      if (off + 2 > len) break;

      const segLen = dv.getUint16(off, false);
      if (segLen < 2) break;

      const segStart = off + 2;
      const segEnd = Math.min(off + segLen, len);

      if (marker === 0xffe1 && segStart + 6 <= segEnd) {
        // "Exif\0\0" チェック
        const isExif =
          dv.getUint8(segStart + 0) === 0x45 &&
          dv.getUint8(segStart + 1) === 0x78 &&
          dv.getUint8(segStart + 2) === 0x69 &&
          dv.getUint8(segStart + 3) === 0x66 &&
          dv.getUint8(segStart + 4) === 0x00 &&
          dv.getUint8(segStart + 5) === 0x00;

        if (isExif) {
          const tiffStart = segStart + 6;

          // 1) TIFF 正攻法（セグメント境界内に限定）
          const o1 = readTiffForOrientation(dv, tiffStart, segEnd);
          if (o1 > 0) return o1;

          // 2) 生バイト走査のフォールバック（APP1 内のみ）
          const o2 = rawScanOrientationInApp1(dv, tiffStart, segEnd);
          if (o2 > 0) return o2;
        }
      }

      off = segEnd;
    }
    return -1;
  } catch {
    return -1;
  }
}

// ---- helpers: parse TIFF IFD safely inside APP1 segment -----------------

export function readTiffForOrientation(
  dv: DataView,
  tiffStart: number,
  segmentEnd: number
): number {
  // TIFF header: 8 bytes
  if (tiffStart + 8 > segmentEnd) return -1;

  const byteOrder = dv.getUint16(tiffStart, false);
  const little = byteOrder === 0x4949; // "II"
  if (!little && byteOrder !== 0x4d4d) return -1; // "MM"

  const magic = dv.getUint16(tiffStart + 2, little);
  if (magic !== 0x002a) return -1;

  const ifd0Offset = dv.getUint32(tiffStart + 4, little);
  const ifd0 = tiffStart + ifd0Offset;
  if (ifd0 + 2 > segmentEnd) return -1;

  const num = dv.getUint16(ifd0, little);
  let p = ifd0 + 2;

  for (let i = 0; i < num; i++) {
    if (p + 12 > segmentEnd) break;

    const tag = dv.getUint16(p + 0, little);
    const type = dv.getUint16(p + 2, little);
    const count = dv.getUint32(p + 4, little);
    const valueField = p + 8;

    if (tag === 0x0112 && type === 3 && count >= 1) {
      // SHORT の値が 4 バイト内に収まるケース
      if (count <= 2) {
        const orientationValue = dv.getUint16(
          valueField + (little ? 0 : 2),
          little
        );
        if (isValidOrient(orientationValue)) {
          return orientationValue;
        }
      } else {
        // 値がオフセット参照
        const dataOffset = dv.getUint32(valueField, little);
        const pos = tiffStart + dataOffset;
        if (pos + 2 <= segmentEnd) {
          const v = dv.getUint16(pos, little);
          if (isValidOrient(v)) return v;
        }
      }
    }
    p += 12;
  }
  return -1;
}

// ---- fallback: raw scan inside APP1 payload -----------------------------

function rawScanOrientationInApp1(
  dv: DataView,
  start: number,
  end: number
): number {
  // TIFF ヘッダ(8B) を超えた先までざっくり探索（12B アラインに限定しない）
  for (let p = start; p + 12 <= end; p += 2) {
    const tagBE = dv.getUint16(p + 0, false);
    const tagLE = dv.getUint16(p + 0, true);
    if (tagBE !== 0x0112 && tagLE !== 0x0112) continue;

    const typeBE = dv.getUint16(p + 2, false);
    const typeLE = dv.getUint16(p + 2, true);
    const looksShort = typeBE === 0x0003 || typeLE === 0x0003;
    if (!looksShort) continue;

    // value フィールド（4B）
    const beHi = dv.getUint16(p + 8, false);
    const beLo = dv.getUint16(p + 10, false);
    const leHi = dv.getUint16(p + 8, true);
    const leLo = dv.getUint16(p + 10, true);

    if (isValidOrient(beHi)) return beHi;
    if (isValidOrient(beLo)) return beLo;
    if (isValidOrient(leHi)) return leHi;
    if (isValidOrient(leLo)) return leLo;
  }
  return -1;
}

// ---- correctImageOrientation --------------------------------------------

export async function correctImageOrientation(blob: Blob): Promise<Blob> {
  try {
    const orientation = await getOrientation(blob);
    if (orientation <= 0 || orientation === 1) return blob;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const imageBitmap = await (globalThis as any).createImageBitmap(blob);
    const { width, height } = imageBitmap;

    let canvasWidth = width;
    let canvasHeight = height;

    if (orientation === 6 || orientation === 8) {
      canvasWidth = height;
      canvasHeight = width;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = new (globalThis as any).OffscreenCanvas(
      canvasWidth,
      canvasHeight
    );
    const ctx = canvas.getContext?.('2d');
    if (!ctx) return blob;

    switch (orientation) {
      case 2:
        ctx.translate(canvasWidth, 0);
        ctx.scale(-1, 1);
        break;
      case 3:
        ctx.translate(canvasWidth, canvasHeight);
        ctx.rotate(Math.PI);
        break;
      case 4:
        ctx.translate(0, canvasHeight);
        ctx.scale(1, -1);
        break;
      case 5:
        ctx.rotate(0.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 6:
        ctx.translate(canvasWidth, 0);
        ctx.rotate(0.5 * Math.PI);
        break;
      case 7:
        ctx.rotate(1.5 * Math.PI);
        ctx.scale(1, -1);
        break;
      case 8:
        ctx.translate(0, canvasHeight);
        ctx.rotate(1.5 * Math.PI);
        break;
    }

    ctx.drawImage(imageBitmap, 0, 0);
    const out = await canvas.convertToBlob?.({ type: blob.type });
    return out instanceof Blob ? out : blob;
  } catch {
    return blob;
  }
}

export default { getOrientation, correctImageOrientation };
