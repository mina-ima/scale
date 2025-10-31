import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera';

import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';

import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

// 4点補正/等倍率の状態とポイント追加（Zustand）
import { useMeasureStore } from '../store/measureStore';
// 平面補正後の距離算出ユーティリティ（mmで返る）
import { distanceWithHomography, isValidHomography } from '../core/geometry/homography';

type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

function distancePx(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function formatMmToUnit(mm: number, units: Units): { value: number; label: string } {
  if (!Number.isFinite(mm)) return { value: NaN, label: 'NaN' };
  switch (units) {
    case 'mm': return { value: mm, label: `${mm.toFixed(1)} mm` };
    case 'cm': return { value: mm / 10, label: `${(mm / 10).toFixed(2)} cm` };
    case 'inch': return { value: mm / 25.4, label: `${(mm / 25.4).toFixed(3)} in` };
    default: return { value: mm, label: `${mm.toFixed(1)} mm` };
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

  // ストアから各種状態を取得
  const selectionMode = useMeasureStore((s: any) => s.selectionMode);
  const addPointToStore = useMeasureStore((s: any) => s.addPoint);
  const homography = useMeasureStore((s: any) => s.homography);
  const scale = useMeasureStore((s: any) => s.scale); // { mmPerPx } が入る

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
      setMeasurementText('画像を表示しました。2点をタップして計測、または「4点補正」を開始してください。');
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
      // ★ 4点補正モード中は「消去しない＆最大4点保持」
      if (selectionMode === 'calibrate-plane') {
        const next = [...prev, p].slice(-4);

        drawMeasurementPoint(ctx, p);

        try {
          if (typeof addPointToStore === 'function') {
            addPointToStore(p);
          }
        } catch {
          // noop
        }

        const n = next.length;
        if (n < 4) {
          setMeasurementText(`補正ポイント ${n}/4：続けてタップしてください`);
        } else {
          setMeasurementText('4/4 点が選択されました。「適用」を押してください');
        }
        return next;
      }

      // 通常の2点計測：3点目で「画像まで消さない」ため、ここでは背景消去ではなくオーバーレイをリセットし新規1点目から
      if (prev.length >= 2) {
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        drawMeasurementPoint(ctx, p);
        setMeasurementText('');
        return [p];
      }

      const next = [...prev, p];
      drawMeasurementPoint(ctx, p);

      // 2点そろったら距離を算出して表示
      if (next.length === 2) {
        const [a, b] = next;
        let label = '';
        // 優先1: 4点補正（ホモグラフィ）→ mm
        if (isValidHomography(homography)) {
          const mm = distanceWithHomography(homography, a, b);
          const { label: text } = formatMmToUnit(mm, units);
          label = text;
        }
        // 優先2: 等倍率（mm/px）→ mm
        else if (scale && typeof (scale as any).mmPerPx === 'number') {
          const mmPerPx = (scale as any).mmPerPx as number;
          const px = distancePx(a, b);
          const mm = px * mmPerPx;
          const { label: text } = formatMmToUnit(mm, units);
          label = text;
        }
        // どちらも無ければ px（未校正）
        else {
          const px = distancePx(a, b);
          label = `${px.toFixed(0)} px（未校正）`;
        }

        setMeasurementText(label);
        drawMeasurementLine(ctx, a, b, { units } as any);
        drawMeasurementLabel(ctx, a, b, label);
      }

      return next;
    });
  }, [toInternalPoint, units, selectionMode, addPointToStore, homography, scale]);

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
    setMeasurementText('写真を取り込みました。2点計測または「4点補正」を行ってください。');
  }, [drawCoverToCanvas]);

  const onPickPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onPhotoSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 画面に確実に反映
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      drawCoverToCanvas(img, (img as HTMLImageElement).naturalWidth || (img as HTMLImageElement).width, (img as HTMLImageElement).naturalHeight || (img as HTMLImageElement).height);
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
            disabled={selectionMode === 'calibrate-plane'} // 補正中は単位変更をロック（任意）
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
            disabled={selectionMode === 'calibrate-plane'} // 補正中は誤タップ防止でリセット無効（任意）
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
