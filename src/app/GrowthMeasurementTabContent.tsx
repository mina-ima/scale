import React, { useCallback, useEffect, useRef } from 'react';
import { useCamera } from '../core/camera/useCamera'; // useCameraをインポート
import { useMeasureStore } from '../store/measureStore';
import { generateFileName, saveImageToDevice } from '../utils/fileUtils';
import { ItemKey } from '../utils/fileUtils';
import { calculate2dDistance } from '../core/measure/calculate2dDistance';

interface GrowthMeasurementTabContentProps {
  mode: ItemKey;
}

const GrowthMeasurementTabContent: React.FC<GrowthMeasurementTabContentProps> = ({ mode }) => {
  const { measurement, points, addPoint, clearPoints, setMeasurement } = useMeasureStore();
  const { stream, startCamera, stopCamera } = useCamera(); // useCameraフックを使用
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // コンポーネントのマウント時にカメラを開始
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  //取得したストリームをvideo要素に接続
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // canvasへの描画処理（変更なし）
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        if (points.length > 0) {
          ctx.fillStyle = 'red';
          points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
          });
        }
        if (measurement?.valueCm) {
          ctx.font = '20px Arial';
          ctx.fillStyle = 'white';
          ctx.fillText(`${measurement.valueCm} cm`, 10, 50);
        }
      }
    }
  }, [points, measurement]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (points.length === 2) {
        clearPoints();
        addPoint({ x, y });
      } else {
        addPoint({ x, y });
      }
    },
    [points, addPoint, clearPoints]
  );

  const composeAndSaveImage = useCallback(async (saveMode: ItemKey) => {
    if (!measurement?.valueMm || !points.length) {
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    // 描画用の新しいCanvasを作成
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = video.videoWidth;
    compositeCanvas.height = video.videoHeight;
    const ctx = compositeCanvas.getContext('2d');
    if (!ctx) return;

    // Videoの現在のフレームを描画
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // measurementCanvasの内容を重ねて描画
    ctx.drawImage(canvas, 0, 0);

    compositeCanvas.toBlob(async (blob) => {
      if (blob) {
        const fileName = generateFileName(
          saveMode,
          measurement.valueMm,
          'cm',
          measurement.dateISO || new Date().toISOString().split('T')[0]
        );
        await saveImageToDevice(blob, fileName);
      }
    });
  }, [measurement, points]);

  useEffect(() => {
    if (points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];
      const distance = calculate2dDistance(p1, p2);
      setMeasurement({ valueCm: distance / 10, valueMm: distance, dateISO: new Date().toISOString().split('T')[0] });
    } else if (points.length === 0) {
      setMeasurement(null);
    }
  }, [points, setMeasurement]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />
      <canvas
        ref={canvasRef}
        data-testid={`growth-record-canvas-${mode}`}
        className="absolute top-0 left-0 w-full h-full z-10 bg-transparent"
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={handleClick}
      />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => composeAndSaveImage(mode)}
        >
          {mode === 'shinchou' && '身長保存'}
          {mode === 'te' && '手保存'}
          {mode === 'ashi' && '足保存'}
        </button>
      </div>
    </div>
  );
};

export default GrowthMeasurementTabContent;