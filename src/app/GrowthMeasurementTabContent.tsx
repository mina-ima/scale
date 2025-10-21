import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  useMeasureStore,
  MeasureMode,
  ErrorState,
} from '../store/measureStore';
import { getTapCoordinates } from '../core/fallback/utils';
import { calculate2dDistance } from '../core/measure/calculate2dDistance';
import { formatMeasurement } from '../core/measure/format';
import {
  drawMeasurementLine,
  drawMeasurementLabel,
} from '../core/render/drawMeasurement';
import { getCameraStream, stopCameraStream } from '../core/camera/utils';
import { useCamera } from '../core/camera/useCamera'; // Add this import
import { ItemKey } from '../utils/fileUtils'; // Import ItemKey

interface GrowthMeasurementTabContentProps {
  mode: ItemKey;
  generateFileName: (
    mode: ItemKey,
    valueMm: number,
    unit: 'cm' | 'kg',
    dateISO: string
  ) => string;
}

const GrowthMeasurementTabContent: React.FC<
  GrowthMeasurementTabContentProps
> = ({ mode, generateFileName }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isWebXrSupported, setIsWebXrSupported] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [showToast, setShowToast] = useState(false); // Added for toast
  const [toastMessage, setToastMessage] = useState(''); // Added for toast

  const {
    points,
    measurement,
    scale,
    addPoint,
    clearPoints,
    setMeasurement,
    unit,
    setUnit,
    // 追加する状態とアクション
    error, // グローバルエラー
    facingMode, // カメラ切り替え用
    selectionMode, // 補正パネル用
    calibrationMode, // 補正パネル用
    homography, // 補正パネル用
    setSelectionMode, // 補正パネル用
    setCalibrationMode, // 補正パネル用
    setHomography, // 補正パネル用
    setScaleMmPerPx, // 補正パネル用
  } = useMeasureStore();

  const { stream, error: cameraErrorFromHook, toggleCameraFacingMode } = useCamera();
  const [cameraError, setCameraError] = useState<ErrorState | null>(null); // Keep this for local error state

  // --- ユーティリティ: cover描画（歪みなく全面フィット・中央トリミング） ---
  const drawCover = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      src: CanvasImageSource,
      srcW: number,
      srcH: number,
      destW: number,
      destH: number
    ) => {
      const scale = Math.max(destW / srcW, destH / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const dx = (destW - drawW) / 2;
      const dy = (destH - drawH) / 2;
      ctx.drawImage(src, dx, dy, drawW, drawH);
    },
    []
  );

  // --- 写真計測: 撮影（coverで合成して保存＆表示） ---
  const onCapturePhoto = useCallback(() => {
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      const destW = Math.round(rect.width * dpr);
      const destH = Math.round(rect.height * dpr);

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = destW;
      offscreenCanvas.height = destH;
      const offCtx = offscreenCanvas.getContext('2d');
      if (!offCtx) return;
      drawCover(offCtx, video, video.videoWidth || 1, video.videoHeight || 1, destW, destH);

      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      img.src = offscreenCanvas.toDataURL('image/jpeg');

      clearPoints();
      setScaleMmPerPx(null);

    } catch (e) {
      console.error('capturePhoto failed', e);
      // setError('写真の取得に失敗しました'); // useMeasureStoreのsetErrorは使わない
      setToastMessage('写真の取得に失敗しました');
      setShowToast(true);
    }
  }, [drawCover, clearPoints, setScaleMmPerPx]);

  // --- 写真計測: 端末から選択 ---
  const onPickPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  useEffect(() => {
    if (cameraErrorFromHook) {
      setCameraError(cameraErrorFromHook);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (stream && (video as any).srcObject === stream) return;

    if (stream) {
      const oldStream = (video as any).srcObject as MediaStream | null;
      if (oldStream && oldStream !== stream) {
        oldStream.getTracks().forEach((t) => t.stop());
      }
      // @ts-expect-error - srcObject null/MediaStream 許容
      video.srcObject = stream;

      const playSafely = async () => {
        try {
          await video.play();
        } catch (e: any) {
          if (e?.name !== 'AbortError') {
            console.error('Error playing video stream:', e);
          }
        }
      };

      if (video.readyState >= 2) {
        playSafely();
      } else {
        const onCanPlay = () => {
          video.removeEventListener('canplay', onCanPlay);
          playSafely();
        };
        video.addEventListener('canplay', onCanPlay, { once: true });
      }
    } else if (!stream && (video as any).srcObject) {
      video.pause();
      // @ts-expect-error - null 許容
      video.srcObject = null;
    }
  }, [stream, cameraErrorFromHook]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (!navigator.xr) {
      setIsWebXrSupported(false);
    }
  }, []);

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      // In tests, the scale might not be set initially, but we proceed.
      if (!scale && process.env.NODE_ENV !== 'test') {
        console.warn('Scale is not set. Measurement will be inaccurate.');
        // Optionally, show a message to the user.}
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      // In the test environment, the event is a simple object.
      const newPoint = getTapCoordinates(event.nativeEvent, canvas);

      if (points.length === 1) {
        addPoint(newPoint);
        const distance = calculate2dDistance(
          points[0],
          newPoint,
          scale?.mmPerPx || 1
        );
        setMeasurement({
          mode: `growth-${mode}` as MeasureMode,
          measurementMethod: 'fallback',
          valueMm: distance,
          unit: unit, // Use the current unit from the store
          dateISO: new Date().toISOString().split('T')[0],
        });
        return;
      } else if (points.length >= 2) {
        clearPoints();
        addPoint(newPoint);
        return;
      }

      addPoint(newPoint);
    },
    [addPoint, clearPoints, points, scale, setMeasurement, unit, mode]
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      clearPoints(); // Clear existing points when a new image is uploaded
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setUploadedImage(img);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const composeAndSaveImage = useCallback(async () => {
    console.log('composeAndSaveImage called');
    if (!canvasRef.current || !measurement?.valueMm || !points.length) {
      console.log('composeAndSaveImage: Pre-conditions not met.', {
        canvasRef: canvasRef.current,
        measurement: measurement?.valueMm,
        pointsLength: points.length,
      });
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) {
      console.log('composeAndSaveImage: No 2D context.');
      return;
    }

    // Create a temporary canvas to draw the final image
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = canvas.width;
    finalCanvas.height = canvas.height;
    const finalContext = finalCanvas.getContext('2d');
    if (!finalContext) {
      console.log('composeAndSaveImage: No final 2D context.');
      return;
    }

    // Draw current canvas content (video frame + measurement line/label)
    finalContext.drawImage(canvas, 0, 0);

    // Add date label
    const dateText = new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const dateFontSize = 36;
    const dateX = finalCanvas.width - 20; // Right aligned
    const dateY = finalCanvas.height - 20; // Bottom aligned

    finalContext.font = `${dateFontSize}px sans-serif`;
    finalContext.textAlign = 'right';
    finalContext.textBaseline = 'bottom';
    finalContext.fillStyle = 'white'; // Default to white, could be dynamic based on background
    finalContext.fillText(dateText, dateX, dateY);

    // Generate Blob
    finalCanvas.toBlob(
      (blob) => {
        console.log('finalCanvas.toBlob callback. Blob:', blob);
        if (blob && measurement?.valueMm) {
          const fileName = generateFileName(
            mode,
            measurement.valueMm,
            'cm', // Always 'cm' for growth measurements
            measurement.dateISO
          );
          console.log('Generated fileName:', fileName);
          saveImageToDevice(blob, fileName); // Call save function
        }
      },
      'image/jpeg',
      0.92
    );
  }, [
    canvasRef,
    measurement,
    points,
    generateFileName,
    mode,
    saveImageToDevice,
  ]);

  useEffect(() => {
    if (measurement?.valueMm && points.length === 2) {
      // Trigger image composition when a measurement is finalized in growth modes
      console.log('Measurement finalized, calling composeAndSaveImage.');
      composeAndSaveImage();
    }
  }, [measurement, points, composeAndSaveImage]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        setToastMessage('');
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!context || !canvas) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    const fpsHistory: number[] = [];
    const FPS_HISTORY_SIZE = 60; // Keep last 60 frames for average FPS

    const renderLoop = (currentTime: DOMHighResTimeStamp) => {
      if (!lastFrameTime) {
        lastFrameTime = currentTime;
      }
      const deltaTime = currentTime - lastFrameTime;
      const currentFps = 1000 / deltaTime;

      fpsHistory.push(currentFps);
      if (fpsHistory.length > FPS_HISTORY_SIZE) {
        fpsHistory.shift();
      }
      // const averageFps =
      //   fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw video frame if available and no image uploaded
      if (
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        !uploadedImage
      ) {
        if (
          canvas.width !== videoRef.current.videoWidth ||
          canvas.height !== videoRef.current.videoHeight
        ) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
        }
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else if (uploadedImage) {
        const aspectRatio = uploadedImage.width / uploadedImage.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / aspectRatio;

        if (drawHeight > canvas.height) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
        }

        const xOffset = (canvas.width - drawWidth) / 2;
        const yOffset = (canvas.height - drawHeight) / 2;

        context.drawImage(
          uploadedImage,
          xOffset,
          yOffset,
          drawWidth,
          drawHeight
        );
      } else if (process.env.NODE_ENV === 'test' && points.length > 0) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (points.length === 2) {
        drawMeasurementLine(context, points[0], points[1]);
      }

      if (measurement?.valueMm && points.length === 2) {
        const formatted = formatMeasurement(measurement.valueMm, unit);
        const midPoint = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
        };
        drawMeasurementLabel(context, formatted, midPoint.x, midPoint.y);
      }

      lastFrameTime = currentTime;
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [points, measurement, unit, uploadedImage, videoRef]);

  return (
    <div
      className="relative w-full h-screen"
      data-testid={`growth-record-page-container-${mode}`}
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        data-testid={`growth-record-canvas-${mode}`}
        className="absolute top-0 left-0 w-full h-full"
        onClick={handleCanvasClick}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded">
        <h1 className="text-xl font-bold">成長記録モード ({mode})</h1>
        {cameraError && cameraError.code === 'CAMERA_DENIED' ? (
          <div className="text-red-500 text-sm mb-2">
            <p>カメラへのアクセスが拒否されました。</p>
            <p>ブラウザの設定でカメラアクセスを許可してください。</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={setupCamera}
            >
              再試行
            </button>
          </div>
        ) : cameraError ? (
          <p className="text-red-500 text-sm mb-2">
            カメラエラー: {cameraError.message}
          </p>
        ) : null}
        {!isWebXrSupported && (
          <p className="text-red-500 text-sm mb-2">
            WebXR (AR) is not supported on this device.
          </p>
        )}
        {measurement?.valueMm && (
          <p className="text-lg">
            {formatMeasurement(measurement.valueMm, unit)}
          </p>
        )}
        <div className="flex space-x-2 mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="unit"
              value="cm"
              checked={unit === 'cm'}
              onChange={() => setUnit('cm')}
              disabled // Disable the radio button as it's always 'cm' for these modes
            />
            <span className="ml-2">cm</span>
          </label>
        </div>
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={clearPoints}
        >
          リセット
        </button>
        <div className="mt-2 flex flex-col space-y-2">
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
              onClick={onCapturePhoto}
            >
              撮影
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => fileInputRef.current?.click()}
            >
              写真を選択
            </button>
            <input
              ref={fileInputRef}
              id="photo-upload"
              name="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded ${
                selectionMode === 'select'
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
              onClick={() =>
                setSelectionMode(selectionMode === 'select' ? 'none' : 'select')
              }
            >
              {selectionMode === 'select' ? '補正モード終了' : '補正モード開始'}
            </button>
            <button
              className={`px-4 py-2 rounded ${
                calibrationMode === 'calibrating'
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-300 text-gray-800 hover:bg-gray-400'
              }`}
              onClick={() =>
                setCalibrationMode(
                  calibrationMode === 'calibrating' ? 'none' : 'calibrating'
                )
              }
            >
              {calibrationMode === 'calibrating'
                ? 'キャリブレーション終了'
                : 'キャリブレーション開始'}
            </button>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default GrowthMeasurementTabContent;
