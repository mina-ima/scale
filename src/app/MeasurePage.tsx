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
  const { stream, startCamera, stopCamera, toggleCameraFacingMode } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [measurementText, setMeasurementText] = useState<string>('');
  const [units, setUnits] = useState<Units>('cm');

  const [scaleDialog, setScaleDialog] = useState<{ open: boolean; confidence: number | null }>({
    open: false,
    confidence: null,
  });

  // ★ 静止画表示中フラグ
  const [hasStillImage, setHasStillImage] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- camera lifecycle ---
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      // @ts-expect-error: srcObject はモダンブラウザで利用可
      videoRef.current.srcObject = stream;
      // ライブ復帰時には静止画フラグを下げておく
      setHasStillImage(false);
    }
  }, [stream]);

  // ====== cover描画ユーティリティ（静止画を可視キャンバスへ） ======
  const drawCoverToCanvas = useCallback((src: CanvasImageSource, srcW: number, srcH: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    // 親div基準のCSSピクセルから物理解像度を決める
    const rect = canvas.getBoundingClientRect();
    const destW = Math.max(1, Math.round(rect.width * dpr));
    const destH = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== destW || canvas.height !== destH) {
      canvas.width = destW;
      canvas.height = destH;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // cover: 全体フィット・中央トリミング
    const scale = Math.max(destW / srcW, destH / srcH);
    const drawW = Math.max(1, Math.round(srcW * scale));
    const drawH = Math.max(1, Math.round(srcH * scale));
    const dx = Math.round((destW - drawW) / 2);
    const dy = Math.round((destH - drawH) / 2);

    ctx.clearRect(0, 0, destW, destH);
    ctx.drawImage(src, dx, dy, drawW, drawH);

    // 静止画に切り替え（以降はこの上にポイント/ラインを描く）
    setHasStillImage(true);
    setPoints([]);
    setMeasurementText('画像を表示しました。2点をタップして計測してください。');
  }, []);

  // ====== 計測処理 ======
  const clearAll = useCallback(() => {
    setPoints([]);
    setMeasurementText('');
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    // 静止画もクリア
    setHasStillImage(false);
  }, []);

  const doTap = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null) => {
    const rect = currentTarget?.getBoundingClientRect?.() ?? { left: 0, top: 0 };
    const p: Point = { x: clientX - rect.left, y: clientY - rect.top };
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !canvasRef.current) return;

    setPoints((prev) => {
      if (prev.length >= 2) {
        // 3点目でリセットして再計測開始
        // ※静止画自体は保持したいので drawCoverToCanvas の再呼び出しはしない
        ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
        // 静止画がある場合は再描画（背景の消失を防ぐ）
        if (hasStillImage && videoRef.current) {
          // 再描画には直前の静止画ソースが必要だが、簡易対応：videoが表示状態ならそれを背景化
          const v = videoRef.current;
          if (v.videoWidth && v.videoHeight) {
            drawCoverToCanvas(v, v.videoWidth, v.videoHeight);
          } else {
            setHasStillImage(false); // 保険
          }
        }
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
        drawMeasurementLine(ctx, next[0], next[1], { units });
        drawMeasurementLabel(ctx, next[0], next[1], text);
      }

      return next;
    });
  }, [units, hasStillImage, drawCoverToCanvas]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // UIコントロール上のイベントは無視
    if ((e.target as HTMLElement).closest('[data-ui-control="true"]')) return;
    doTap(e.clientX, e.clientY, e.currentTarget as HTMLElement);
  }, [doTap]);

  // ====== 「写真を撮る」→ キャンバスへ反映 ======
  const onCapturePhoto = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth || !v.videoHeight) {
      setMeasurementText('カメラ準備中です');
      return;
    }
    drawCoverToCanvas(v, v.videoWidth, v.videoHeight);
    setMeasurementText('写真を取り込みました。2点をタップして計測してください。');
  }, [drawCoverToCanvas]);

  // ====== 「写真を選ぶ」→ キャンバスへ反映 ======
  const onPickPhoto = useCallback(() => fileInputRef.current?.click(), []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // 即時プレビュー（cover描画）
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

      // 参考: スケール推定（プレビューには影響なし）
      const result = await estimateScale(file as any);
      const confidence = (result as any)?.confidence ?? 0;
      setScaleDialog({ open: confidence >= 0.8, confidence });
    } finally {
      e.target.value = '';
    }
  }, [drawCoverToCanvas]);

  // ====== カメラ切替・AR（未実装） ======
  const onToggleCameraFacingMode = useCallback(() => {
    toggleCameraFacingMode(); // useCamera側で再起動される
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
        // ライブが見えるのは hasStillImage=false のとき。true でも下に見えてOK（上に静止画canvasを描く）
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />

      {/* 静止画/描画用キャンバス（上に出す） */}
      <canvas
        ref={canvasRef}
        // width/height は drawCoverToCanvas でデバイスピクセル密度に合わせて調整
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          backgroundColor: 'transparent',
          // 計測タップは親divで拾うため、キャンバスはクリック無効のままでOK
          pointerEvents: 'none',
        }}
      />

      {/* 上部オーバーレイ */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}
        data-ui-control="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div data-testid="measurement-readout" aria-live="polite" className="bg-black/50 text-white p-2 rounded-md m-2 inline-block">
          {measurementText || (hasStillImage ? '画像上で2点をタップ' : 'タップして計測を開始')}
        </div>

        <div className="absolute top-2 right-2">
          <label htmlFor="units-select" className="sr-only">Unit selection / 単位</label>
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

      {/* 下部オーバーレイ */}
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
        <div className="p-4 flex justify-between items-center">
          <MeasureControlButtons
            onStartARSession={onStartARSession}
            onToggleCameraFacingMode={onToggleCameraFacingMode}
            onCapturePhoto={onCapturePhoto}
            onPickPhoto={onPickPhoto}
            isArSupported={false}
          />
          <button type="button" data-testid="reset-button" onClick={clearAll} className="bg-red-500/80 text-white p-3 rounded-full shadow-lg">
            Reset
          </button>
        </div>
      </div>

      {/* 非表示のファイル入力（「写真を選ぶ」） */}
      <input
        ref={fileInputRef}
        data-testid="hidden-file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* スケール推定ダイアログ（任意） */}
      {scaleDialog.open && (
        <div role="dialog" aria-modal="true" className="absolute inset-0 bg-black/40 flex items-center justify-center zIndex-50">
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div>スケール推定の信頼度: {Math.round((scaleDialog.confidence ?? 0) * 100)}%</div>
          </div>
        </div>
      )}
    </div>
  );
}
