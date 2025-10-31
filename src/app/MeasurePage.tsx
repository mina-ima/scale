import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera';

import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';

import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

// 4点補正用のストア（selectionMode と addPoint を利用）
import { useMeasureStore } from '../store/measureStore';

type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

// 背景画像キャッシュ：オリジナル解像度のオフスクリーンと、再描画時のレイアウト計算関数
type CoverCache = {
  offscreen: HTMLCanvasElement; // srcW x srcH の原寸コピー
};

function distancePx(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
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

  // 4点補正の状態とポイント追加
  const selectionMode = useMeasureStore((s: any) => s.selectionMode);
  const addPointToStore = useMeasureStore((s: any) => s.addPoint);

  // ★ 追加：背景静止画のオリジナルを保持（画像の「開放」を防ぐ）
  const coverCacheRef = useRef<CoverCache | null>(null);

  // --- DPR対応: キャンバス内部サイズをCSS×DPRの整数に ---
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

  // ストリームをvideoへ
  useEffect(() => {
    if (videoRef.current && stream) {
      // @ts-expect-error: srcObject はモダンブラウザで利用可
      (videoRef.current as any).srcObject = stream;
    }
  }, [stream]);

  // リサイズに追随（背景を再描画）
  useEffect(() => {
    resizeCanvasToContainer();
    const onResize = () => {
      resizeCanvasToContainer();
      const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true } as any);
      if (ctx && canvasRef.current) repaintBase(ctx);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeCanvasToContainer]);

  // ====== 背景の再描画（静止画があれば貼り直し、なければ透明クリア） ======
  const repaintBase = useCallback((ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const destW = canvas.width;
    const destH = canvas.height;

    ctx.clearRect(0, 0, destW, destH);

    const cache = coverCacheRef.current;
    if (!cache) {
      // 背景が無いときは透明（背後にvideoが見える）
      return;
    }

    const srcW = cache.offscreen.width;
    const srcH = cache.offscreen.height;

    const scale = Math.max(destW / srcW, destH / srcH);
    const drawW = Math.max(1, Math.round(srcW * scale));
    const drawH = Math.max(1, Math.round(srcH * scale));
    const dx = Math.round((destW - drawW) / 2);
    const dy = Math.round((destH - drawH) / 2);

    ctx.drawImage(cache.offscreen, dx, dy, drawW, drawH);
  }, []);

  // ====== cover描画（静止画を可視キャンバスへ＆オフスクリーンに保持） ======
  const drawCoverToCanvas = useCallback(
    (src: CanvasImageSource, srcW: number, srcH: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d', { willReadFrequently: true } as any);
      if (!ctx) return;

      // 1) オフスクリーンに原寸でコピー（以後はこれを背景として使う＝開放しない）
      const off = document.createElement('canvas');
      off.width = Math.max(1, Math.round(srcW));
      off.height = Math.max(1, Math.round(srcH));
      const offCtx = off.getContext('2d');
      if (offCtx) {
        // 原寸コピー（必要なら補間OFFも検討）
        offCtx.drawImage(src, 0, 0, off.width, off.height);
      }
      coverCacheRef.current = { offscreen: off };

      // 2) 表示キャンバスにフィットで貼る
      repaintBase(ctx);

      // 3) ガイダンス
      setPoints([]);
      setMeasurementText('画像を表示しました。2点計測するか、「4点補正」を開始してください。');
    },
    [repaintBase]
  );

  const clearAll = useCallback(() => {
    setPoints([]);
    setMeasurementText('');
    coverCacheRef.current = null; // ★ 背景も明示的に破棄（ユーザー明示操作のみ）
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // CSS→内部ピクセル座標に変換（DPRスケーリング＆整数化）
  const toInternalPoint = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null): Point => {
    const rect = currentTarget?.getBoundingClientRect?.() ?? { left: 0, top: 0, width: 1, height: 1 };
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const xCss = clientX - rect.left;
    const yCss = clientY - rect.top;
    return { x: Math.round(xCss * dpr), y: Math.round(yCss * dpr) };
  }, []);

  // ====== タップ処理 ======
  const doTap = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null) => {
    const p = toInternalPoint(clientX, clientY, currentTarget);
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true } as any);
    if (!ctx || !canvasRef.current) return;

    setPoints((prev) => {
      // 4点補正モード：消さずに最大4点まで保持・可視化
      if (selectionMode === 'calibrate-plane') {
        const next = [...prev, p].slice(-4);

        // 背景を再描画してから新しい点を描く（既存マーカーも残す簡便策として、都度点を打つだけ）
        repaintBase(ctx);
        next.forEach(pt => drawMeasurementPoint(ctx, pt));

        try {
          if (typeof addPointToStore === 'function') addPointToStore(p);
        } catch { /* noop */ }

        const n = next.length;
        setMeasurementText(n < 4 ? `補正ポイント ${n}/4：続けてタップしてください` : '4/4 点が選択されました。「適用」を押してください');
        return next;
      }

      // 通常 2点計測：3点目で「画像開放」せず、背景を保持したままオーバーレイだけリセット
      if (prev.length >= 2) {
        // 背景を貼り直してから、新しい1点目を描画
        repaintBase(ctx);
        drawMeasurementPoint(ctx, p);
        setMeasurementText('');
        return [p];
      }

      // 1点目/2点目の処理
      const next = [...prev, p];

      // 背景を再描画（別の描画が残っている可能性があるため）→ 既存ポイントと今回の点を描く
      repaintBase(ctx);
      next.forEach(pt => drawMeasurementPoint(ctx, pt));

      if (next.length === 2) {
        const px = distancePx(next[0], next[1]);
        const text = `${px.toFixed(0)} px（未校正）`;
        setMeasurementText(text);
        drawMeasurementLine(ctx, next[0], next[1], { units } as any);
        drawMeasurementLabel(ctx, next[0], next[1], text);
      }

      return next;
    });
  }, [toInternalPoint, units, selectionMode, addPointToStore, repaintBase]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // UI上のクリックは拾わない
      if ((e.target as HTMLElement).closest('[data-ui-control="true"]')) return;
      doTap(e.clientX, e.clientY, e.currentTarget as HTMLElement);
    },
    [doTap],
  );

  // ====== ボタン用ハンドラ ======
  const onCapturePhoto = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth || !v.videoHeight) {
      setMeasurementText('カメラ準備中です');
      return;
    }
    // 現在フレームを背景静止画として取り込み（以後は保持）
    drawCoverToCanvas(v, v.videoWidth, v.videoHeight);
    setMeasurementText('写真を取り込みました。2点計測または「4点補正」を行ってください。');
  }, [drawCoverToCanvas]);

  const onPickPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

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

    // 入力クリア
    e.target.value = '';
  }, [drawCoverToCanvas]);

  const onToggleCameraFacingMode = useCallback(() => {
    if (typeof toggleCameraFacingMode === 'function') {
      toggleCameraFacingMode();
    } else {
      setMeasurementText('カメラ切替APIが未提供です');
    }
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
          {measurementText || (selectionMode === 'calibrate-plane' ? '補正ポイントを4点タップしてください' : 'タップして計測を開始')}
        </div>

        <div className="absolute top-2 right-2">
          <label htmlFor="units-select" className="sr-only">Unit selection / 単位</label>
          <select
            id="units-select"
            aria-label="Unit selection / 単位"
            value={units}
            onChange={(e) => setUnits(e.target.value as Units)}
            className="bg-black/50 text-white p-2 rounded-md"
            disabled={selectionMode === 'calibrate-plane'}
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
            disabled={selectionMode === 'calibrate-plane'}
          >
            Reset
          </button>
        </div>
      </div>

      {/* 非表示のファイル入力：画面反映のみ行う */}
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
