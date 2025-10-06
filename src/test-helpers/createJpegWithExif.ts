// src/test-helpers/createJpegWithExif.ts

/**
 * 指定した EXIF Orientation を持つ最小 JPEG を生成します（"MM"=Big Endian）。
 * - APP1 size は「自身を含む」長さ
 * - TIFF IFD0 は 1 エントリのみ（0x0112: SHORT, count=1）
 * - MM(ビッグエンディアン)では、4B value フィールド内に収まる値は
 *   後ろの2B（offset+10..+11）に格納するのが正しい配置
 */
export function createJpegWithExifOrientation(
  orientation: number
): ArrayBuffer {
  // 1..8 の範囲に収める（範囲外は 1 = 正常に寄せる）
  const ori = orientation >= 1 && orientation <= 8 ? orientation : 1;

  // --- TIFF（"MM"）を構築 ---
  // header(8) + numEntries(2) + entry(12) + nextIFD(4) = 26 bytes
  const tiff = new Uint8Array(8 + 2 + 12 + 4);
  const tv = new DataView(tiff.buffer);

  // TIFF header
  tv.setUint16(0, 0x4d4d, false); // "MM" BE
  tv.setUint16(2, 0x002a, false); // magic
  tv.setUint32(4, 8, false); // IFD0 offset (=8 from TIFF start)

  // IFD0
  let off = 8;
  tv.setUint16(off, 1, false); // numEntries = 1
  off += 2;

  // entry (12 bytes)
  // 0x0112 Orientation, type=3(SHORT), count=1, value in 4B field
  tv.setUint16(off + 0, 0x0112, false); // tag
  tv.setUint16(off + 2, 3, false); // type=SHORT
  tv.setUint32(off + 4, 1, false); // count=1

  // ★ MM(Big Endian) では value は 4B フィールドの後ろ側 2B に格納する
  tv.setUint16(off + 8, 0, false); // 上位側を 0 でパディング
  tv.setUint16(off + 10, ori, false); // 後ろの2Bに値

  off += 12;

  // nextIFD = 0
  tv.setUint32(off, 0, false);
  off += 4;

  // --- APP1 payload = "Exif\0\0" + TIFF ---
  const exifHeader = new TextEncoder().encode('Exif\0\0'); // 6 bytes
  const payload = new Uint8Array(exifHeader.length + tiff.length);
  payload.set(exifHeader, 0);
  payload.set(tiff, exifHeader.length);

  // --- JPEG 全体: SOI + APP1(marker+size+payload) ---
  // APP1 size は「size フィールド自身を含む」ので payload.length + 2
  const app1Size = payload.length + 2;
  const jpeg = new Uint8Array(2 + 2 + 2 + payload.length);
  const jv = new DataView(jpeg.buffer);

  let j = 0;
  jv.setUint16(j, 0xffd8, false);
  j += 2; // SOI
  jv.setUint16(j, 0xffe1, false);
  j += 2; // APP1 marker
  jv.setUint16(j, app1Size, false);
  j += 2; // APP1 size (including these 2 bytes)
  jpeg.set(payload, j);
  j += payload.length;

  return jpeg.buffer;
}

export default createJpegWithExifOrientation;
