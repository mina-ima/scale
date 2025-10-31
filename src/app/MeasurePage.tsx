import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera';

import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';

import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

import { useMeasureStore } from '../store/measureStore';

type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

// 背景静止画の原寸キャッシュ
type CoverCache = { offscreen: HTMLCanvasElement };

function distancePx(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function formatMmToUnit(mm: number, units: Units): string {
  if (!Number.isFinite(mm)) return 'NaN';
  switch (units) {
    case 'mm':   return `${mm.toFixed(1)} mm`;
    case 'cm':   return `${(mm / 10).toFixed(2)} cm`;
    case 'inch': return `${(mm / 25.4).toFixed(3)} in`;
    default:     return `${mm.toFixed(1)} mm`;
  }
}

export default function MeasurePage() {
  const { stream, startCamera, stopCamera, toggleCameraFacingMode } = useCamera() as any;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [measurementText, setMeasurementText] = useState<string>('');
  const [units, setUnits] = useState<Units>('cm');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ストア
  const selectionMode = useMeasureStore((s: any) => s.selectionMode);  // 'measure' | 'calibrate-two' | 'calibrate-plane'
  const addPointToStore = useMeasureStore((s: any) => s.addPoint);
  const mmPerPx = useMeasureStore((s: any) =>
    typeof s?.mmPerPx === 'number' ? s.mmPerPx : s?.scale?.mmPerPx
  ) as number | undefined;

  // 背景キャッシュ（リセット押下まで維持）
  const coverCacheRef = useRef<CoverCache | null>(null);

  // DPR対応
  const resizeCanvasToContainer = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }, []);

  // カメラ開始/停止
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // video へ stream
  useEffect(() => {
    if (videoRef.current && stream) {
      // @ts-expect-error
      (videoRef.current as any).srcObject = stream;
    }
  }, [stream]);

  // リサイズ時に背景を再描画
  useEffect(() => {
    resizeCanvasToContainer();
    const onResize = () => {
      resizeCanvasToContainer();
      const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true } as any);
      if (ctx) repaintBase(ctx);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeCanvasToContainer]);

  // 背景の再描画
  const repaintBase = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const destW = canvas.width;
    const destH = canvas.height;
    ctx.clearRect(0, 0, destW, destH);

    const cache = coverCacheRef.current;
    if (!cache) return; // 背景未設定（背後の video が見える）

    const srcW = cache.offscreen.width;
    const srcH = cache.offscreen.height;
    const scale = Math.max(destW / srcW, destH / srcH);
    const drawW = Math.max(1, Math.round(srcW * scale));
    const drawH = Math.max(1, Math.round(srcH * scale));
    const dx = Math.round((destW - drawW) / 2);
    const dy = Math.round((destH - drawH) / 2);
    ctx.drawImage(cache.offscreen, dx, dy, drawW, drawH);
  }, []);

  // 静止画を表示＆キャッシュ
  const drawCoverToCanvas = useCallback((src: CanvasImageSource, srcW: number, srcH: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true } as any);
    if (!ctx) return;

    // 原寸をオフスクリーンに保持
    const off = document.createElement('canvas');
    off.width = Math.max(1, Math.round(srcW));
    off.height = Math.max(1, Math.round(srcH));
    const offCtx = off.getContext('2d');
    offCtx?.drawImage(src, 0, 0, off.width, off.height);
    coverCacheRef.current = { offscreen: off };

    // 表示
    repaintBase(ctx);

    // ガイダンス
    setPoints([]);
    setMeasurementText('画像を表示しました。補正ポイントを指定して「適用」→その後に計測してください。');
  }, [repaintBase]);

  const clearAll = useCallback(() => {
    setPoints([]);
    setMeasurementText('');
    coverCacheRef.current = null; // 背景も明示的に破棄（ユーザー操作のみ）
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // CSS座標→内部座標
  const toInternalPoint = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null): Point => {
    const rect = currentTarget?.getBoundingClientRect?.() ?? { left: 0, top: 0, width: 1, height: 1 };
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    return { x: Math.round((clientX - rect.left) * dpr), y: Math.round((clientY - rect.top) * dpr) };
  }, []);

  // クリック処理
  const doTap = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null) => {
    const p = toInternalPoint(clientX, clientY, currentTarget);
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true } as any);
    if (!ctx || !canvasRef.current) return;

    setPoints((prev) => {
      // === 補正モード：点を収集するだけ ===
      if (selectionMode === 'calibrate-plane') {
        const next = [...prev, p].slice(-4);
        repaintBase(ctx);
        next.forEach(pt => drawMeasurementPoint(ctx, pt));
        try { if (typeof addPointToStore === 'function') addPointToStore(p); } catch {}
        const n = next.length;
        setMeasurementText(n < 4 ? `補正ポイント（4点） ${n}/4：続けてタップ` : '4/4 点が選択されました。「適用」を押してください');
        return next;
      }
      if (selectionMode === 'calibrate-two') {
        const next = [...prev, p].slice(-2);
        repaintBase(ctx);
        next.forEach(pt => drawMeasurementPoint(ctx, pt));
        try { if (typeof addPointToStore === 'function') addPointToStore(p); } catch {}
        const n = next.length;
        setMeasurementText(n < 2 ? `補正ポイント（2点） ${n}/2：続けてタップ` : '2/2 点が選択されました。基準を選んで「適用」してください');
        return next;
      }

      // === 測定モード ===
      if (prev.length >= 2) {
        // 背景を保持したまま、オーバーレイだけリセット
        repaintBase(ctx);
        drawMeasurementPoint(ctx, p);
        setMeasurementText('');
        return [p];
      }

      const next = [...prev, p];
      repaintBase(ctx);
      next.forEach(pt => drawMeasurementPoint(ctx, pt));

      if (next.length === 2) {
        const [a, b] = next;
        const px = distancePx(a, b);

        if (typeof mmPerPx === 'number' && Number.isFinite(mmPerPx) && mmPerPx > 0) {
          const mm = px * mmPerPx;
          const label = formatMmToUnit(mm, units);
          setMeasurementText(label);
          drawMeasurementLine(ctx, a, b, { units } as any);
          drawMeasurementLabel(ctx, a, b, label);
        } else {
          const label = `${px.toFixed(0)} px（未校正）`;
          setMeasurementText(label);
          drawMeasurementLine(ctx, a, b, { units } as any);
          drawMeasurementLabel(ctx, a, b, label);
        }
      }

      return next;
    });
  }, [toInternalPoint, units, selectionMode, addPointToStore, mmPerPx, repaintBase]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('[data-ui-control="true"]')) return; // UIは除外
    doTap(e.clientX, e.clientY, e.currentTarget as HTMLElement);
  }, [doTap]);

  // ボタン群
  const onCapturePhoto = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth || !v.videoHeight) {
      setMeasurementText('カメラ準備中です');
      return;
    }
    drawCoverToCanvas(v, v.videoWidth, v.videoHeight);
    setMeasurementText('写真を取り込みました。補正ポイントを指定→「適用」後に計測してください。');
  }, [drawCoverToCanvas]);

  const onPickPhoto = useCallback(() => fileInputRef.current?.click(), []);

  const onPhotoSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const w = (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width;
      const h = (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height;
      drawCoverToCanvas(img, w, h);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      setMeasurementText('画像の読み込みに失敗しました');
    };
    img.src = url;
    e.target.value = '';
  }, [drawCoverToCanvas]);

  const onToggleCameraFacingMode = useCallback(() => {
    if (typeof toggleCameraFacingMode === 'function') toggleCameraFacingMode();
    else setMeasurementText('カメラ切替APIが未提供です');
  }, [toggleCameraFacingMode]);

  const onStartARSession = useCallback(() => {
    setMeasurementText('この端末ではAR未対応/未実装です');
  }, []);

  return (
    <div
      ref={containerRef}
      data-testid="measure-page-container"
      onClick={handlePointerDown}
      style={{ width: '100%', height: '100vh', position: 'relative', userSelect: 'none' }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, backgroundColor: 'transparent', pointerEvents: 'none' }}
      />

      {/* 上部UI */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}
        data-ui-control="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div data-testid="measurement-readout" aria-live="polite" className="bg-black/50 text-white p-2 rounded-md m-2 inline-block">
          {measurementText ||
            (selectionMode === 'calibrate-plane'
              ? '補正ポイント（4点）を指定→基準を選んで「適用」'
              : selectionMode === 'calibrate-two'
              ? '補正ポイント（2点）を指定→基準を選んで「適用」'
              : '（計測）2点をタップ')}
        </div>

        <div className="absolute top-2 right-2">
          <label htmlFor="units-select" className="sr-only">Unit selection / 単位</label>
          <select
            id="units-select"
            aria-label="Unit selection / 単位"
            value={units}
            onChange={(e) => setUnits(e.target.value as Units)}
            className="bg-black/50 text-white p-2 rounded-md"
            disabled={selectionMode === 'calibrate-plane' || selectionMode === 'calibrate-two'}
          >
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="inch">inch</option>
          </select>
        </div>
      </div>

      {/* 下部UI */}
      <div
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}
        data-ui-control="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <MeasureCalibrationPanel />
        </div>
        <div className="p-4 flex justify-between">
          <MeasureControlButtons
            onStartARSession={onStartARSession}
            onToggleCameraFacingMode={onToggleCameraFacingMode}
            onCapturePhoto={onCapturePhoto}
            onPickPhoto={onPickPhoto}
            isArSupported={false}
          />
          <button
            type="button"
            data-testid="reset-button"
            onClick={clearAll}
            className="bg-red-500/80 text-white p-3 rounded-full shadow-lg"
            disabled={selectionMode === 'calibrate-plane' || selectionMode === 'calibrate-two'}
          >
            Reset
          </button>
        </div>
      </div>

      {/* 非表示のファイル入力 */}
      <input
        ref={fileInputRef}
        data-testid="hidden-file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onPhotoSelected}
      />
    </div>
  );
}
