import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera';

import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';

import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

// 補正状態（selectionMode）と補正点の追加、スケール(mmPerPx)を参照
import { useMeasureStore } from '../store/measureStore';

type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

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
  // カメラ切替も利用
  const { stream, startCamera, stopCamera, toggleCameraFacingMode } = useCamera() as any;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [measurementText, setMeasurementText] = useState<string>('');
  const [units, setUnits] = useState<Units>('cm');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // 「写真を選ぶ」用

  // ストアから補正状態とスケールを購読
  const selectionMode = useMeasureStore((s: any) => s.selectionMode); // 'measure' | 'calibrate-two' | 'calibrate-plane' などを想定
  const addPointToStore = useMeasureStore((s: any) => s.addPoint);
  // mmPerPx は s.mmPerPx or s.scale.mmPerPx のどちらでも拾う
  const mmPerPx = useMeasureStore((s: any) =>
    typeof s?.mmPerPx === 'number' ? s.mmPerPx : s?.scale?.mmPerPx
  ) as number | undefined;

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

    // CSSはそのまま100%
    (canvas.style as any).width = '100%';
    (canvas.style as any).height = '100%';
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

  // リサイズに追随
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

      // 背景を静止画にしたので、測定はクリア
      setPoints([]);
      setMeasurementText('画像を表示しました。補正ポイントを指定して「適用」→その後に計測してください。');
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

  // CSS→内部ピクセル座標に変換（DPRスケーリング＆整数化）
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
      // === 補正モード：クリックは補正ポイント収集のみ ===
      if (selectionMode === 'calibrate-plane') {
        const next = [...prev, p].slice(-4);
        drawMeasurementPoint(ctx, p);
        if (typeof addPointToStore === 'function') {
          try { addPointToStore(p); } catch {}
        }
        const n = next.length;
        setMeasurementText(n < 4 ? `補正ポイント（4点） ${n}/4：続けてタップ` : '4/4 点が選択されました。「適用」を押してください');
        return next;
      }

      if (selectionMode === 'calibrate-two') {
        const next = [...prev, p].slice(-2);
        drawMeasurementPoint(ctx, p);
        if (typeof addPointToStore === 'function') {
          try { addPointToStore(p); } catch {}
        }
        const n = next.length;
        setMeasurementText(n < 2 ? `補正ポイント（2点） ${n}/2：続けてタップ` : '2/2 点が選択されました。基準を選んで「適用」してください');
        return next;
      }

      // === 計測モード ===
      // 3点目でリセット（背景は維持）、新しい1点目から
      if (prev.length >= 2) {
        const w = canvasRef.current!.width, h = canvasRef.current!.height;
        const imageData = ctx.getImageData(0, 0, w, h); // 背景が video の場合はこの方法だと消えるため、必要に応じて二層化を検討
        ctx.putImageData(imageData, 0, 0); // ここでは背景を維持する前提（静止画が貼られているケースを想定）
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        drawMeasurementPoint(ctx, p);
        setMeasurementText('');
        return [p];
      }

      const next = [...prev, p];
      drawMeasurementPoint(ctx, p);

      if (next.length === 2) {
        const [a, b] = next;
        const px = distancePx(a, b);

        // mmPerPx が設定済み（＝補正適用済み）なら実寸表示
        if (typeof mmPerPx === 'number' && Number.isFinite(mmPerPx) && mmPerPx > 0) {
          const mm = px * mmPerPx;
          const label = formatMmToUnit(mm, units);
          setMeasurementText(label);
          drawMeasurementLine(ctx, a, b, { units } as any);
          drawMeasurementLabel(ctx, a, b, label);
        } else {
          // 未補正なら px（未校正）
          const label = `${px.toFixed(0)} px（未校正）`;
          setMeasurementText(label);
          drawMeasurementLine(ctx, a, b, { units } as any);
          drawMeasurementLabel(ctx, a, b, label);
        }
      }

      return next;
    });
  }, [toInternalPoint, units, selectionMode, addPointToStore, mmPerPx]);

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
    drawCoverToCanvas(v, v.videoWidth, v.videoHeight);
    setMeasurementText('写真を取り込みました。補正ポイントを指定→「適用」後に計測してください。');
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
            disabled={selectionMode === 'calibrate-plane' || selectionMode === 'calibrate-two'} // 補正中は単位変更をロック
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
            disabled={selectionMode === 'calibrate-plane' || selectionMode === 'calibrate-two'} // 補正中は誤タップ防止
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
