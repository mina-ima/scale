import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera';

import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';

import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

import { estimateScale } from '../core/reference/ScaleEstimation';

type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

function distancePx(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function MeasurePage() {
  // toggleCameraFacingMode を使用（カメラ切替）
  const { stream, startCamera, stopCamera, toggleCameraFacingMode } = useCamera() as any;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [measurementText, setMeasurementText] = useState<string>('');
  const [units, setUnits] = useState<Units>('cm');

  const [scaleDialog, setScaleDialog] = useState<{
    open: boolean;
    confidence: number | null;
  }>({ open: false, confidence: null });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // 「写真を選ぶ」用

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

    // CSSはそのまま100%でOK
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      // @ts-expect-error: srcObject はモダンブラウザで利用可
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    resizeCanvasToContainer();
    const onResize = () => resizeCanvasToContainer();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeCanvasToContainer]);

  // ====== cover描画（静止画を可視キャンバスへ） ======
  const drawCoverToCanvas = useCallback(
    (src: CanvasImageSource, srcW: number, srcH: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const destW = canvas.width;
      const destH = canvas.height;

      const ctx = canvas.getContext('2d', { willReadFrequently: true } as any);
      if (!ctx) return;

      const scale = Math.max(destW / srcW, destH / srcH);
      const drawW = Math.max(1, Math.round(srcW * scale));
      const drawH = Math.max(1, Math.round(srcH * scale));
      const dx = Math.round((destW - drawW) / 2);
      const dy = Math.round((destH - drawH) / 2);

      ctx.clearRect(0, 0, destW, destH);
      ctx.drawImage(src, dx, dy, drawW, drawH);

      // 背景を静止画にしたので、測定はクリアしてメッセージ更新
      setPoints([]);
      setMeasurementText('画像を表示しました。2点をタップして計測してください。');
    },
    []
  );

  const clearAll = useCallback(() => {
    setPoints([]);
    setMeasurementText('');
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // CSS→内部ピクセル座標へ変換（DPRスケーリング＆整数化）
  const toInternalPoint = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null): Point => {
    const rect = currentTarget?.getBoundingClientRect?.() ?? { left: 0, top: 0, width: 1, height: 1 };
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const xCss = clientX - rect.left;
    const yCss = clientY - rect.top;
    return { x: Math.round(xCss * dpr), y: Math.round(yCss * dpr) };
  }, []);

  const doTap = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null) => {
    const p = toInternalPoint(clientX, clientY, currentTarget);
    const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true } as any);
    if (!ctx || !canvasRef.current) return;

    setPoints((prev) => {
      if (prev.length >= 2) {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        setMeasurementText('');
        drawMeasurementPoint(ctx, p);
        return [p];
      }

      const next = [...prev, p];
      drawMeasurementPoint(ctx, p);

      if (next.length === 2) {
        const px = distancePx(next[0], next[1]);
        const text = `${px.toFixed(0)} px（未校正）`;
        setMeasurementText(text);
        drawMeasurementLine(ctx, next[0], next[1], { units } as any);
        drawMeasurementLabel(ctx, next[0], next[1], text);
      }

      return next;
    });
  }, [toInternalPoint, units]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-ui-control="true"]')) {
        return;
      }
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
    drawCoverToCanvas(v, v.videoWidth, v.videoHeight);
    setMeasurementText('写真を取り込みました。2点をタップして計測してください。');
  }, [drawCoverToCanvas]);

  const onPickPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onPhotoSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        drawCoverToCanvas(img, img.naturalWidth || img.width, img.naturalHeight || img.height);
        URL.revokeObjectURL(url);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        setMeasurementText('画像の読み込みに失敗しました');
      };
      img.src = url;

      // 参考: スケール推定（画面反映には影響させない）
      // ファイル版の推定APIを使っている場合はここで実行
      const result = await estimateScale([] as any, [] as any).catch(() => null);
      void result;
    } finally {
      e.target.value = '';
    }
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

  // ====== ファイル選択でのスケール推定（従来のハンドラは残すが UI 反映は上のonPhotoSelectedで行う） ======
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await estimateScale(file as any);
        const confidence = (result as any)?.confidence ?? 0;
        if (confidence >= 0.8) {
          setScaleDialog({ open: true, confidence });
        } else {
          setScaleDialog({ open: false, confidence });
        }
      } catch {
        setScaleDialog({ open: false, confidence: null });
      } finally {
        e.target.value = '';
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      data-testid="measure-page-container"
      onClick={handlePointerDown}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          backgroundColor: 'transparent',
          pointerEvents: 'none', // 描画のみ
        }}
      />

      {/* UIオーバーレイ */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}
        data-ui-control="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div
          data-testid="measurement-readout"
          aria-live="polite"
          className="bg-black/50 text-white p-2 rounded-md m-2 inline-block"
        >
          {measurementText || 'タップして計測を開始'}
        </div>

        <div className="absolute top-2 right-2">
          <label htmlFor="units-select" className="sr-only">
            Unit selection / 単位
          </label>
          <select
            id="units-select"
            aria-label="Unit selection / 単位"
            value={units}
            onChange={(e) => setUnits(e.target.value as Units)}
            className="bg-black/50 text-white p-2 rounded-md"
          >
            <option value="cm">cm</option>
            <option value="mm">mm</option>
            <option value="inch">inch</option>
          </select>
        </div>
      </div>

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
          >
            Reset
          </button>
        </div>
      </div>

      {/* 非表示のファイル入力（画面反映: onPhotoSelected / 推定UI: handleFileChange） */}
      <input
        ref={fileInputRef}
        data-testid="hidden-file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          onPhotoSelected(e);
          // スケール推定ダイアログも使いたい場合は下の行を残す
          handleFileChange(e);
        }}
      />

      {scaleDialog.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div>スケール推定の信頼度: {Math.round((scaleDialog.confidence ?? 0) * 100)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
