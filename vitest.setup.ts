// vitest.setup.ts
// JSDOM で欠けているブラウザ API を最初にモックして、テストの待ちを防ぐ

// 1) requestAnimationFrame
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 16) as unknown as number;
}
if (typeof globalThis.cancelAnimationFrame === 'undefined') {
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id as unknown as number);
}

// 2) PointerEvent / setPointerCapture
if (typeof (globalThis as any).PointerEvent === 'undefined') {
  class PointerEvent extends Event {
    pointerId = 1;
    clientX = 0;
    clientY = 0;
    constructor(type: string, params: any = {}) {
      super(type, params);
      Object.assign(this, params);
    }
  }
  (globalThis as any).PointerEvent = PointerEvent;
}
if (!(Element.prototype as any).setPointerCapture) {
  (Element.prototype as any).setPointerCapture = () => {};
}
if (!(Element.prototype as any).releasePointerCapture) {
  (Element.prototype as any).releasePointerCapture = () => {};
}

// 3) getBoundingClientRect（座標→正規化のため、0 以外を返す）
const rect = { x: 0, y: 0, left: 0, top: 0, width: 320, height: 240, right: 320, bottom: 240, toJSON: () => {} };
if (!HTMLElement.prototype.getBoundingClientRect) {
  HTMLElement.prototype.getBoundingClientRect = function () { return rect as any; };
} else {
  const original = HTMLElement.prototype.getBoundingClientRect;
  HTMLElement.prototype.getBoundingClientRect = function () {
    const r = original.apply(this) as any;
    // JSDOM は 0 を返しがちなので、0 のときだけデフォルト矩形を返す
    if (!r || (!r.width && !r.height)) return rect as any;
    return r;
  };
}

// 4) Canvas 2D のモック
type Ctx2D = CanvasRenderingContext2D & Record<string, any>;
const createMock2dCtx = (): Ctx2D => {
  let _fillStyle: any = '#000';
  let _strokeStyle: any = '#000';
  let _lineWidth = 1;
  let _font = '10px sans-serif';
  return {
    // 状態系
    canvas: {} as any,
    save() {},
    restore() {},
    translate() {},
    rotate() {},
    scale() {},
    setTransform() {},
    resetTransform() {},
    // パス系
    beginPath() {},
    closePath() {},
    moveTo() {},
    lineTo() {},
    rect() {},
    arc() {},
    ellipse() {},
    quadraticCurveTo() {},
    bezierCurveTo() {},
    stroke() {},
    fill() {},
    clip() {},
    isPointInPath() { return false; },
    // 描画系
    clearRect() {},
    fillRect() {},
    strokeRect() {},
    drawImage() {},
    putImageData() {},
    getImageData() { return { data: new Uint8ClampedArray(4), width: 1, height: 1 } as ImageData; },
    // テキスト
    fillText() {},
    strokeText() {},
    measureText(text: string) { return { width: (text?.length ?? 1) * 8 } as TextMetrics; },
    // dash
    setLineDash() {},
    getLineDash() { return []; },
    // スタイル
    get fillStyle() { return _fillStyle; },
    set fillStyle(v) { _fillStyle = v; },
    get strokeStyle() { return _strokeStyle; },
    set strokeStyle(v) { _strokeStyle = v; },
    get lineWidth() { return _lineWidth; },
    set lineWidth(v) { _lineWidth = v; },
    get font() { return _font; },
    set font(v) { _font = v; },
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    textAlign: 'left',
    textBaseline: 'alphabetic',
    imageSmoothingEnabled: true,
    // 非標準・便宜
    __mock: true,
  } as unknown as Ctx2D;
};

if (!(HTMLCanvasElement.prototype as any).__patched) {
  const ctx2d = createMock2dCtx();
  (HTMLCanvasElement.prototype as any).getContext = function (type: string) {
    if (type === '2d') return ctx2d;
    // WebGL 系は未使用なら null で OK（必要ならダミーを追加）
    return null;
  };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/png;base64,mock';
  (HTMLCanvasElement.prototype as any).__patched = true;
}

// Path2D のダミー（使っていれば）
if (typeof (globalThis as any).Path2D === 'undefined') {
  (globalThis as any).Path2D = class { addPath() {} closePath() {} moveTo() {} lineTo() {} arc() {} rect() {} };
}

// 5) Video の再生・srcObject
(() => {
  const proto = HTMLVideoElement.prototype as any;
  if (!proto.play) proto.play = () => Promise.resolve();
  if (!proto.pause) proto.pause = () => {};
  if (!('srcObject' in proto)) {
    let _srcObject: MediaStream | null = null;
    Object.defineProperty(proto, 'srcObject', {
      get() { return _srcObject; },
      set(v) { _srcObject = v; },
      configurable: true,
    });
  }
})();

// 6) createImageBitmap
if (typeof (globalThis as any).createImageBitmap === 'undefined') {
  (globalThis as any).createImageBitmap = async (img: any) => ({ width: img?.width ?? 1, height: img?.height ?? 1 });
}

// 7) 視覚的タイマーを有効化（JSDOMの内部最適化回避）
try {
  // 一部ランナーでは存在しないが、あれば true にしておく
  (globalThis as any).__VITEST__?.resetModules?.();
} catch {}
