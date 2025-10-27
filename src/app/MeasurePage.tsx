import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera'; // useCameraをインポート

// === 自作コンポーネント ===
import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';

// === 描画ユーティリティ ===
import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

// === スケール推定 ===
import { estimateScale } from '../core/reference/ScaleEstimation';

// === 型定義 ===
type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

function distancePx(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function MeasurePage() {
  // カメラ
  const { stream, startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);

  // 計測用
  const [points, setPoints] = useState<Point[]>([]);
  const [measurementText, setMeasurementText] = useState<string>('');
  const [units, setUnits] = useState<Units>('cm');

  // 画像選択→スケール推定用
  const [scaleDialog, setScaleDialog] = useState<{
    open: boolean;
    confidence: number | null;
  }>({ open: false, confidence: null });

  // Canvas / コンテナ参照
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // カメラの開始と停止
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  // ストリームをvideo要素に接続
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // ====== 測定処理 ======
  const clearAll = useCallback(() => {
    setPoints([]);
    setMeasurementText('');
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  const doTap = useCallback((clientX: number, clientY: number, currentTarget: HTMLElement | null) => {
    const rect = currentTarget?.getBoundingClientRect?.() ?? { left: 0, top: 0 };
    const p: Point = { x: clientX - rect.left, y: clientY - rect.top };
    const ctx = canvasRef.current?.getContext('2d');
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
        drawMeasurementLine(ctx, next[0], next[1], { units });
        drawMeasurementLabel(ctx, next[0], next[1], text);
      }

      return next;
    });
  }, [units]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // UIコントロール上のイベントは無視
      if ((e.target as HTMLElement).closest('[data-ui-control="true"]')) {
        return;
      }
      doTap(e.clientX, e.clientY, e.currentTarget as HTMLElement);
    },
    [doTap],
  );

  // ====== 画像入力→スケール推定 ======
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

  // ====== UI ======
  return (
    <div
      ref={containerRef}
      data-testid="measure-page-container"
      onPointerDown={handlePointerDown} // ハンドラをコンテナに移動
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
        // onPointerDown={handlePointerDown} // ここから削除
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          zIndex: 10, 
          backgroundColor: 'transparent',
          pointerEvents: 'none', // canvasのポインターイベントを無効化
        }}
      />

      {/* UIオーバーレイ */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }} data-ui-control="true">
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

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }} data-ui-control="true">
        <div className="p-4">
          <MeasureCalibrationPanel />
        </div>
        <div className="p-4 flex justify-between">
          <MeasureControlButtons />
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

      {/* 非表示のファイル入力 */}
      <input
        data-testid="hidden-file-input"
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* スケール推定ダイアログ */}
      {scaleDialog.open && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-0 bg-black/40 flex items-center justify-center z-50"
        >
          <div className="bg-white p-4 rounded-lg shadow-xl">
            <div>
              スケール推定の信頼度: {Math.round((scaleDialog.confidence ?? 0) * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
