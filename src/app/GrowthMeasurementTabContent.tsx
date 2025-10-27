import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useCamera } from '../core/camera/useCamera';
import { useMeasureStore } from '../store/measureStore';
import { generateFileName, saveImageToDevice } from '../utils/fileUtils';
import { ItemKey } from '../utils/fileUtils';
import { calculate2dDistance } from '../core/measure/calculate2dDistance';

// MeasurePageから移植したコンポーネント
import MeasureControlButtons from './MeasureControlButtons';
import MeasureCalibrationPanel from './MeasureCalibrationPanel';
import { estimateScale } from '../core/reference/ScaleEstimation';
import {
  drawMeasurementLine,
  drawMeasurementLabel,
  drawMeasurementPoint,
} from '../core/render/drawMeasurement';

// MeasurePageから移植した型定義
type Point = { x: number; y: number };
type Units = 'cm' | 'mm' | 'inch';

function distancePx(a: Point, b: Point) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

interface GrowthMeasurementTabContentProps {
  mode: ItemKey;
}

const GrowthMeasurementTabContent: React.FC<GrowthMeasurementTabContentProps> = ({ mode }) => {
  // --- MeasurePageから移植したStateとRef ---
  const { stream, startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [measurementText, setMeasurementText] = useState<string>('');
  const [units, setUnits] = useState<Units>('cm');
  const [scaleDialog, setScaleDialog] = useState<{ open: boolean; confidence: number | null }>({ open: false, confidence: null });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- useMeasureStore --- 
  // 保存機能で最終的な計測結果をストアに渡す必要があるかもしれないが、一旦UIの統一を優先
  const { setMeasurement } = useMeasureStore();

  // --- MeasurePageから移植したカメラ関連Effect ---
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // --- MeasurePageから移植した測定ロジック ---
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
        // 最終的な計測結果をストアにセットする
        setMeasurement({ valueCm: px / 10, valueMm: px, dateISO: new Date().toISOString().split('T')[0] });
        drawMeasurementLine(ctx, next[0], next[1], { units });
        drawMeasurementLabel(ctx, next[0], next[1], text);
      }

      return next;
    });
  }, [units, setMeasurement]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest('[data-ui-control="true"]')) {
        return;
      }
      doTap(e.clientX, e.clientY, e.currentTarget as HTMLElement);
    },
    [doTap],
  );

  // --- 既存の保存ロジックを移植したUIに統合 ---
  const composeAndSaveImage = useCallback(async () => {
    const measurement = points.length === 2 ? distancePx(points[0], points[1]) : 0;
    if (measurement <= 0) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = video.videoWidth;
    compositeCanvas.height = video.videoHeight;
    const ctx = compositeCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    ctx.drawImage(canvas, 0, 0);

    compositeCanvas.toBlob(async (blob) => {
      if (blob) {
        const fileName = generateFileName(
          mode,
          measurement, // mm単位の計測値
          'cm',
          new Date().toISOString().split('T')[0]
        );
        await saveImageToDevice(blob, fileName);
      }
    });
  }, [points, mode]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative w-full h-full user-select-none"
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute top-0 left-0 w-full h-full z-10 bg-transparent pointer-events-none"
      />

      {/* UIオーバーレイ (MeasurePageから移植) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }} data-ui-control="true">
        <div className="bg-black/50 text-white p-2 rounded-md m-2 inline-block">
          {measurementText || 'タップして計測を開始'}
        </div>
        <div className="absolute top-2 right-2">
          <select
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
        <div className="p-4 flex justify-between items-center">
          <MeasureControlButtons />
          {/* 保存ボタン */}
          <button
            onClick={composeAndSaveImage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={points.length !== 2}
          >
            {mode === 'shinchou' && '身長保存'}
            {mode === 'te' && '手保存'}
            {mode === 'ashi' && '足保存'}
          </button>
          <button
            onClick={clearAll}
            className="bg-red-500/80 text-white p-3 rounded-full shadow-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrowthMeasurementTabContent;