import { Point } from '../fallback/utils';
import { getOptimalTextColorForRegion } from '../../utils/colorUtils';

const TEXT_BACKGROUND_COLOR_DARK = 'rgba(17, 24, 39, 0.7)';   // 暗色背景（gray-900 / 70%）
const TEXT_BACKGROUND_COLOR_LIGHT = 'rgba(255, 255, 255, 0.7)'; // 明色背景
const TEXT_PADDING = 10;

type Units = 'cm' | 'mm' | 'inch';

function clampInt(n: number, min: number, max: number): number {
  const i = Math.floor(Number.isFinite(n) ? n : 0);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}

function safeGetImageData(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
): ImageData | null {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  // 整数化 + 1以上
  let ix = clampInt(x, 0, W - 1);
  let iy = clampInt(y, 0, H - 1);
  let iw = Math.max(1, Math.floor(w));
  let ih = Math.max(1, Math.floor(h));

  // 右下にはみ出さないようクランプ
  if (ix + iw > W) iw = Math.max(1, W - ix);
  if (iy + ih > H) ih = Math.max(1, H - iy);

  try {
    return ctx.getImageData(ix, iy, iw, ih);
  } catch {
    // セキュリティ制約や範囲外などで失敗したら null
    return null;
  }
}

/**
 * 測定点（円）
 */
export const drawMeasurementPoint = (
  context: CanvasRenderingContext2D,
  p: Point,
  color: string = '#FF007F',
  radius: number = 10
): void => {
  context.save();
  context.beginPath();
  context.fillStyle = color;
  context.arc(p.x, p.y, radius, 0, Math.PI * 2);
  context.fill();
  // 見やすさ向上の白縁
  context.lineWidth = 2;
  context.strokeStyle = '#ffffff';
  context.stroke();
  context.restore();
};

/**
 * 測定線
 */
export const drawMeasurementLine = (
  context: CanvasRenderingContext2D,
  p1: Point,
  p2: Point,
  color: string = '#10b981', // emerald
  lineWidth: number = 5
): void => {
  context.save();
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';
  context.moveTo(p1.x, p1.y);
  context.lineTo(p2.x, p2.y);
  context.stroke();
  context.restore();

  // 端点も描く
  drawMeasurementPoint(context, p1);
  drawMeasurementPoint(context, p2);
};

/**
 * ラベル描画（オーバーロード互換）
 * 呼び出しA: drawMeasurementLabel(ctx, pointA, pointB, text)
 * 呼び出しB: drawMeasurementLabel(ctx, text, x, y, fontSize?, fontFamily?)
 */
export function drawMeasurementLabel(
  context: CanvasRenderingContext2D,
  aOrText: Point | string,
  bOrX: Point | number,
  textOrY: string | number,
  fontSize: number = 48,
  fontFamily: string = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
): void {
  // 呼び出し形を判定
  let text: string;
  let cx: number;
  let cy: number;

  if (typeof aOrText === 'string') {
    // 形B: (ctx, text, x, y, ...)
    text = aOrText;
    cx = typeof bOrX === 'number' ? bOrX : (bOrX as any)?.x ?? 0;
    cy = typeof textOrY === 'number' ? textOrY : (textOrY as any)?.y ?? 0;
  } else {
    // 形A: (ctx, pointA, pointB, text)
    const p1 = aOrText as Point;
    const p2 = bOrX as Point;
    text = String(textOrY);
    cx = (p1.x + p2.x) / 2;
    cy = (p1.y + p2.y) / 2;
  }

  context.save();
  context.font = `600 ${fontSize}px ${fontFamily}`;
  context.textBaseline = 'middle';
  context.textAlign = 'center';

  // テキスト幅（小数→整数化）
  const measured = context.measureText(text);
  const textWidth = Math.ceil(measured.width);
  const textHeight = Math.ceil(fontSize * 1); // 近似

  const boxW = Math.max(1, textWidth + TEXT_PADDING * 2);
  const boxH = Math.max(1, textHeight + TEXT_PADDING * 2);
  const left = cx - boxW / 2;
  const top = cy - boxH / 2;

  // 背景領域の画素を安全に取得（失敗時は null）
  const imageData = safeGetImageData(context, left, top, boxW, boxH);

  // 背景に応じて文字色を決定（失敗時は白）
  let textColor = '#ffffff';
  let bgColor = TEXT_BACKGROUND_COLOR_DARK;
  if (imageData) {
    try {
      textColor = getOptimalTextColorForRegion(imageData);
      // 文字色が明るい場合は薄い背景、暗い場合は濃い背景
      const isLight = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(textColor)
        ? isLightColor(textColor)
        : false;
      bgColor = isLight ? TEXT_BACKGROUND_COLOR_DARK : TEXT_BACKGROUND_COLOR_LIGHT;
    } catch {
      // colorUtils 側で何かあってもフォールバック
      textColor = '#ffffff';
      bgColor = TEXT_BACKGROUND_COLOR_DARK;
    }
  }

  // 背景（角丸）
  drawRoundedRect(context, left, top, boxW, boxH, 8, bgColor);

  // テキスト
  context.fillStyle = textColor;
  context.fillText(text, cx, cy);

  context.restore();
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  fillStyle: string
) {
  const rr = Math.max(0, Math.min(r, Math.floor(Math.min(w, h) / 2)));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

/** #rrggbb が「明るい」か簡易判定 */
function isLightColor(hex: string): boolean {
  // #rgb を #rrggbb に拡張
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('');
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  // 相対輝度近似
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // 0..255
  return luma > 160;
}
