import { useState, useEffect, useRef, useCallback } from 'react';
import { useMeasureStore } from '../store/measureStore';
import { getTapCoordinates } from '../core/fallback/utils';
import { calculate2dDistance } from '../core/measure/calculate2dDistance';
import { calculate3dDistance } from '../core/measure/calculate3dDistance';
import { formatMeasurement } from '../core/measure/format';
import {
  drawMeasurementLine,
  drawMeasurementLabel,
} from '../core/render/drawMeasurement';
import { useCamera } from '../core/camera/useCamera'; // useCameraフックをインポート
import {
  isWebXRAvailable,
  startXrSession,
  initHitTestSource,
  get3dPointFromHitTest,
} from '../core/ar/webxrUtils';

const MeasurePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWebXrSupported, setIsWebXrSupported] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(
    null
  );
  const [cameraError, setCameraError] = useState<ErrorState | null>(null);

  // WebXR state
  const [xrSession, setXrSession] = useState<XRSession | null>(null);
  const [xrReferenceSpace, setXrReferenceSpace] =
    useState<XRReferenceSpace | null>(null);
  const [xrHitTestSource, setXrHitTestSource] =
    useState<XRHitTestSource | null>(null);
  const xrFrameRef = useRef<XRFrame | null>(null);

  const {
    points,
    points3d,
    measurement,
    scale,
    addPoint,
    addPoint3d,
    clearPoints,
    setMeasurement,
    measureMode,
    unit,
    setUnit,
  } = useMeasureStore();

  const { stream, error: cameraHookError, startCamera, stopCamera, facingMode, toggleCameraFacingMode } = useCamera(); // useCameraフックを使用

  // WebXRセッション開始関数をuseCallbackでメモ化
  const startARSession = useCallback(async () => {
    if (!isWebXrSupported) {
      console.warn('AR: WebXR is not supported on this device.');
      return;
    }
    if (xrSession) {
      console.log('AR: Session already active.');
      return;
    }

    console.log('AR: Attempting to start AR session via user activation.');
    try {
      const session = await startXrSession(); // startXrSessionを呼び出す
      if (session) {
        setXrSession(session);
        console.log('AR: session set');
        const refSpace = await session.requestReferenceSpace('local');
        setXrReferenceSpace(refSpace);
        console.log('AR: refSpace set');
        const hitSource = await initHitTestSource(session);
        if (hitSource) {
          setXrHitTestSource(hitSource);
          console.log('AR: hitSource set');
        }
      } else {
        console.warn('AR: WebXR session failed to start after user activation.');
      }
    } catch (error) {
      console.error('AR: Error during WebXR session start after user activation:', error);
      // エラーメッセージをユーザーに表示するなどの処理を追加
    }
  }, [isWebXrSupported, xrSession]); // 依存配列を修正

  // Initialize Camera (WebXRが利用可能かどうかに関わらず)
  useEffect(() => {
    const initializeCamera = async () => {
      console.log('AR: Initializing camera...');
      try {
        const mediaStream = await startCamera();
        if (mediaStream instanceof MediaStream && videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          console.log('AR: Camera setup initiated via useCamera hook.');
        } else if (mediaStream && !(mediaStream instanceof MediaStream)) {
          setCameraError(mediaStream); // エラー状態をセット
          console.error('AR: Error during camera setup via useCamera hook:', mediaStream);
        }
      } catch (error) {
        console.error('AR: Error during camera setup via useCamera hook:', error);
      }
    };

    initializeCamera();

    return () => {
      // コンポーネントのアンマウント時やstreamが変更されたときにストリームを停止
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      // useCameraフックから提供されるstopCamera関数を直接呼び出す
      stopCamera();
      xrSession?.end(); // xrSessionの終了もここで行う
    };
  }, [stream, stopCamera, xrSession]); // stopCameraを依存配列に追加

  // WebXRの利用可能性チェック
  useEffect(() => {
    const checkWebXRSupport = async () => {
      console.log('AR: Checking WebXR support...');
      const xrAvailable = await isWebXRAvailable();
      setIsWebXrSupported(xrAvailable);
      console.log('AR: xrAvailable =', xrAvailable);
    };
    checkWebXRSupport();
  }, []); // 空の依存配列で一度だけ実行

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      console.log('handleCanvasClick called');
      console.log('AR: xrSession:', xrSession);
      console.log('AR: xrHitTestSource:', xrHitTestSource);
      console.log('AR: xrReferenceSpace:', xrReferenceSpace);
      console.log('AR: xrFrameRef.current:', xrFrameRef.current);
      if (
        xrSession &&
        xrHitTestSource &&
        xrReferenceSpace &&
        xrFrameRef.current
      ) {
        const point = get3dPointFromHitTest(
          xrFrameRef.current,
          xrHitTestSource,
          xrReferenceSpace
        );
        console.log('AR: get3dPointFromHitTest returned:', point);
        if (point) {
          if (points3d.length >= 2) {
            clearPoints(); // This now clears both 2D and 3D points
          }
          addPoint3d(point);
          console.log('3D point added:', point);
        }
        return;
      }

      // Fallback to 2D logic
      if (!scale) {
        console.warn('Scale is not set. Measurement will be inaccurate.');
        return;
      }

      const canvas = canvasRef.current;
      if (!canvas) return;

      const newPoint = getTapCoordinates(event.nativeEvent, canvas);
      console.log('2D newPoint:', newPoint);

      if (points.length >= 2) {
        clearPoints();
        addPoint(newPoint);
        console.log('2D points cleared, new point added:', newPoint);
        return;
      }

      addPoint(newPoint);
      console.log('2D point added:', newPoint);
    },
    [
      xrSession,
      xrHitTestSource,
      xrReferenceSpace,
      addPoint3d,
      points3d.length,
      clearPoints,
      scale,
      addPoint,
      points.length,
    ]
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

  // 2D Measurement Calculation
  useEffect(() => {
    console.log('2D Measurement useEffect triggered. Points:', points);
    if (points.length === 2) {
      const currentScale = scale ?? {
        mmPerPx: 1,
        source: 'none',
        confidence: 1,
      };
      const distanceMm = calculate2dDistance(
        points[0],
        points[1],
        currentScale.mmPerPx
      );
      const newMeasurement: MeasurementResult = {
        mode: measureMode,
        valueMm: distanceMm,
        unit: unit, // Use the unit from the store
        dateISO: new Date().toISOString(),
      };
      setMeasurement(newMeasurement);
      console.log('2D Measurement calculated:', newMeasurement);
    }
  }, [points, scale, setMeasurement, measureMode, unit]);

  // 3D Measurement Calculation
  useEffect(() => {
    console.log('3D Measurement useEffect triggered. Points3D:', points3d);
    if (points3d.length === 2) {
      const distanceMeters = calculate3dDistance(points3d[0], points3d[1]);
      const distanceMm = distanceMeters * 1000;
      const newMeasurement: MeasurementResult = {
        mode: measureMode,
        valueMm: distanceMm,
        unit: unit,
        dateISO: new Date().toISOString(),
      };
      setMeasurement(newMeasurement);
      console.log('3D Measurement calculated:', newMeasurement);
    }
  }, [points3d, setMeasurement, measureMode, unit]);

  // Render Loop
  useEffect(() => {
    console.log('Render Loop useEffect triggered. Measurement:', measurement);
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas) return;

    let animationFrameId: number;

    const renderLoop = (currentTime: DOMHighResTimeStamp, frame?: XRFrame) => {
      // Store the latest frame for hit testing
      if (frame) {
        xrFrameRef.current = frame;
      }

      // --- 2D Drawing Logic ---
      const ctx = context;
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        !uploadedImage
      ) {
        // カメラの映像をキャンバスに描画
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else if (uploadedImage) {
        // アップロードされた画像をキャンバスに描画
        const aspectRatio = uploadedImage.width / uploadedImage.height;
        let drawWidth = canvas.width;
        let drawHeight = canvas.width / aspectRatio;

        if (drawHeight > canvas.height) {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
        }

        const xOffset = (canvas.width - drawWidth) / 2;
        const yOffset = (canvas.height - drawHeight) / 2;

        ctx.drawImage(uploadedImage, xOffset, yOffset, drawWidth, drawHeight);
      } else if (window.isPlaywrightTest && points.length > 0) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (points.length === 2) {
        drawMeasurementLine(ctx, points[0], points[1]);
      }

      if (measurement?.valueMm && points.length === 2) {
        const formatted = formatMeasurement(measurement.valueMm, unit);
        const midPoint = {
          x: (points[0].x + points[1].x) / 2,
          y: (points[0].y + points[1].y) / 2,
        };
        drawMeasurementLabel(ctx, formatted, midPoint.x, midPoint.y);
      }
      // --- End of 2D Drawing ---

      // Request next frame
      if (xrSession) {
        animationFrameId = xrSession.requestAnimationFrame(renderLoop);
      } else {
        animationFrameId = requestAnimationFrame(renderLoop);
      }
    };

    if (xrSession) {
      animationFrameId = xrSession.requestAnimationFrame(renderLoop);
    } else {
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    return () => {
      if (xrSession) {
        xrSession.cancelAnimationFrame(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [points, measurement, unit, uploadedImage, videoRef, xrSession]);

  return (
    <div
      className="relative w-full h-screen"
      data-testid="measure-page-container"
    >
      <video
        ref={videoRef}
        data-testid="measure-video"
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        data-testid="measure-canvas"
        className="absolute top-0 left-0 w-full h-full"
        onClick={handleCanvasClick}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded">
        <h1 className="text-xl font-bold">計測モード</h1>
        {cameraError && cameraError.code === 'CAMERA_DENIED' ? (
          <div className="text-red-500 text-sm mb-2">
            <p>カメラへのアクセスが拒否されました。</p>
            <p>ブラウザの設定でカメラアクセスを許可してください。</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={startCamera}
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
          <p className="text-orange-500 text-sm mb-2">
            お使いの端末ではAR非対応です。写真で計測に切り替えます。
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
            />
            <span className="ml-2">cm</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="unit"
              value="m"
              checked={unit === 'm'}
              onChange={() => setUnit('m')}
            />
            <span className="ml-2">m</span>
          </label>
        </div>
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={clearPoints}
        >
          リセット
        </button>
        {isWebXrSupported && !xrSession && (
          <button
            className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={startARSession}
          >
            AR計測を開始
          </button>
        )}
        <button
          className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={toggleCameraFacingMode}
        >
          カメラ切り替え ({facingMode === 'user' ? 'インカメラ' : 'アウトカメラ'})
        </button>
        {!isWebXrSupported && (
          <div className="mt-2">
            <label
              htmlFor="photo-upload"
              className="block text-sm font-medium text-gray-700"
            >
              写真を選択
            </label>
            <input
              id="photo-upload"
              name="photo-upload"
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
              onChange={handleImageUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MeasurePage;
