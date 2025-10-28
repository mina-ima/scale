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
  mode: ItemKey | null; // modeをオプショナルに変更
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
  const fileInputRef = useRef<HTMLInputElement>(null); // 「写真を選ぶ」用

  // --- useMeasureStore --- 
  const { setMeasurement } = useMeasureStore();

  // --- カメラ関連Effect ---
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

  // --- DPR対応: キャンバスを CSS×DPR の整数に常時リサイズ ---
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
    // 見た目サイズは100%
    canvas.style.width = '100%';
    canvas.style.height = '100%';
  }, []);

  useEffect(() => {
    resizeCanvasToContainer();
    const onResize = () => resizeCanvasToContainer();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resizeCanvasToContainer]);

  // --- 測定ロジック ---
  const clearAll = useCallback(() => {
    setPoints([]);
    setMeasurementText('');
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, []);

  // CSS座標→内部ピクセル座標へ（DPRスケール＆整数化）
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
        // 成長記録モード側の store 更新（暫定: px→mm/cmの換算は別途補正で上書きされる想定）
        setMeasurement({
          valueCm: px / 10,
          valueMm: px,
          dateISO: new Date().toISOString().split('T')[0],
        });
        drawMeasurementLine(ctx, next[0], next[1], { units });
        drawMeasurementLabel(ctx, next[0], next[1], text);
      }

      return next;
    });
  }, [toInternalPoint, units, setMeasurement]);

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

  // --- 保存ロジック（内部解像度で合成） ---
  const composeAndSaveImage = useCallback(async (saveMode: ItemKey) => {
    const measurement = points.length === 2 ? distancePx(points[0], points[1]) : 0;
    if (measurement <= 0) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // 合成はキャンバスの内部解像度に合わせる
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = canvas.width;
    compositeCanvas.height = canvas.height;
    const ctx = compositeCanvas.getContext('2d', { willReadFrequently: true } as any);
    if (!ctx) return;

    // 背景（video）を内部解像度へ拡大描画
    ctx.drawImage(video, 0, 0, compositeCanvas.width, compositeCanvas.height);
    // オーバーレイ（計測キャンバス）
    ctx.drawImage(canvas, 0, 0);

    compositeCanvas.toBlob(async (blob) => {
      if (blob) {
        const fileName = generateFileName(
          saveMode,
          measurement,
          'cm',
          new Date().toISOString().split('T')[0]
        );
        await saveImageToDevice(blob, fileName);
      }
    });
  }, [points]);

  // --- 画像入力→スケール推定（任意の補助UI） ---
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await estimateScale(file as any);
        const confidence = (result as any)?.confidence ?? 0;
        // ここではダイアログ表示のみ（必要なら store に mm/px を反映する処理へ拡張）
        if (confidence >= 0.8) {
          setScaleDialog({ open: true, confidence });
        } else {
          setScaleDialog({ open: false, confidence });
        }
      } finally {
        e.target.value = '';
      }
    },
    [],
  );

  // --- MeasureControlButtons 用のハンドラ（配線） ---
  const handlePickPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleCapturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth || 1;
    const h = video.videoHeight || 1;

    // 必要ならここで「静止画キャンバスへcover描画」を入れても良いが、
    // Growthタブはライブプレビュー上での計測前提のため、フィードバックのみ
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const ctx = off.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    setMeasurementText('写真を取り込みました');
    // 必要なら off.toBlob(...) → 推定/保存へ
  }, []);

  const handleToggleCameraFacingMode = useCallback(() => {
    setMeasurementText('カメラ切替（暫定）');
    // TODO: useCamera に facingMode 切替APIがあれば置換
  }, []);

  const handleStartARSession = useCallback(() => {
    setMeasurementText('この端末ではAR未対応/未実装です');
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handlePointerDown} // onPointerDownをonClickに変更
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
        // width/heightはJS側でCSS×DPRに合わせて設定する（属性は指定しない）
        className="absolute top-0 left-0 w-full h-full z-10 bg-transparent pointer-events-none"
      />

      {/* UIオーバーレイ（上部: 計測表示・単位） */}
      <div
        style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}
        data-ui-control="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
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

      {/* 下部オーバーレイ（補正パネル + 操作ボタン + 保存） */}
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
        <div className="p-4 flex justify-around items-center">
          <MeasureControlButtons
            onStartARSession={handleStartARSession}
            onToggleCameraFacingMode={handleToggleCameraFacingMode}
            onCapturePhoto={handleCapturePhoto}
            onPickPhoto={handlePickPhoto}
            isArSupported={false}
          />

          {/* 保存ボタン群 */}
          <button
            onClick={() => composeAndSaveImage('shinchou')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={points.length !== 2}
          >
            身長保存
          </button>
          <button
            onClick={() => composeAndSaveImage('te')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={points.length !== 2}
          >
            手保存
          </button>
          <button
            onClick={() => composeAndSaveImage('ashi')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={points.length !== 2}
          >
            足保存
          </button>
          <button
            onClick={clearAll}
            className="bg-red-500/80 text-white p-3 rounded-full shadow-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* 非表示のファイル入力（MeasureControlButtons → onPickPhoto で開く） */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* スケール推定ダイアログ（任意表示） */}
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
};

export default GrowthMeasurementTabContent;
