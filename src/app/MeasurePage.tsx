import { useState, useEffect, useRef, useCallback, type ChangeEvent } from 'react';
import * as THREE from 'three';
import { useMeasureStore } from '../store/measureStore';
import { calculate2dDistance } from '../core/measure/calculate2dDistance';
import { calculate3dDistance } from '../core/measure/calculate3dDistance';
import { useCamera } from '../core/camera/useCamera';
import { isWebXRAvailable } from '../core/ar/webxrUtils';
import { isDistanceExceeded } from '../core/measure/maxDistanceGuard';
import MeasureUIComponent from './MeasureUI';
import { formatMeasurement } from '../core/measure/format';
import {
  drawMeasurementLine,
  drawMeasurementLabel,
} from '../core/render/drawMeasurement';
import { createRenderLoop } from '../core/ar/renderLoopUtils';

const MeasurePage: React.FC = () => {
  const canvas2dRef = useRef<HTMLCanvasElement>(null);
  const canvasWebGLRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // ← 写真選択用
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20)
  );
  const lineRef = useRef<THREE.Line | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const [isTapping, setIsTapping] = useState(false);

  const {
    points,
    points3d,
    scale,
    addPoint,
    addPoint3d,
    clearPoints,
    setMeasurement,
    unit,
    xrSession,
    setXrSession,
    setIsPlaneDetected,
    setArError,
    setIsWebXrSupported,
    setIsArMode,
    isArMode,
    setError,
    error: globalError,
  } = useMeasureStore();

  console.log('MeasurePage: rendered', { isArMode, globalError });

  const { stream, error: cameraError, toggleCameraFacingMode } = useCamera();

  // --- カメラストリームの管理 ---
  useEffect(() => {
    console.log('MeasurePage: useEffect triggered with stream:', stream, 'cameraError:', cameraError);

    if (cameraError) {
      setError(cameraError);
      setIsArMode(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    console.log('MeasurePage: Current videoRef.current.srcObject:', video.srcObject);

    // 同一ストリームなら何もしない
    if (stream && video.srcObject === stream) return;

    if (stream) {
      console.log('MeasurePage: Setting videoRef.current.srcObject to new stream.');
      // 旧ストリームを停止
      const oldStream = video.srcObject as MediaStream | null;
      if (oldStream && oldStream !== stream) {
        oldStream.getTracks().forEach((t) => t.stop());
      }

      // 新ストリームをセット
      // @ts-expect-error - srcObject null/MediaStream 許容
      video.srcObject = stream;

      // Safari対策：canplay/loadedmetadata後に再生
      const playSafely = async () => {
        try {
          await video.play();
          console.log('MeasurePage: Video stream started successfully.');
        } catch (e: any) {
          if (e?.name !== 'AbortError') {
            console.error('MeasurePage: Error playing video stream:', e);
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
    } else if (!stream && video.srcObject) {
      console.log('MeasurePage: Clearing videoRef.current.srcObject as stream is null.');
      video.pause();
      // @ts-expect-error - null 許容
      video.srcObject = null;
    }
  }, [stream, cameraError, setError, setIsArMode]);

  // --- 写真計測: 撮影（背景Videoをキャンバスに転写）
  const onCapturePhoto = useCallback(() => {
    try {
      const video = videoRef.current;
      const canvas = canvas2dRef.current;
      if (!video || !canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const w = video.videoWidth || window.innerWidth;
      const h = video.videoHeight || window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(video, 0, 0, w, h);
      // 以降は2D計測フロー（点打ち）
      setIsArMode(false);
      setError(null);
    } catch (e) {
      console.error('capturePhoto failed', e);
      setError('写真の取得に失敗しました');
    }
  }, [setIsArMode, setError]);

  // --- 写真計測: 端末から選択
  const onPickPhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onPhotoSelected = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const canvas = canvas2dRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      setIsArMode(false);
      setError(null);
    };
    img.onerror = () => setError('画像の読み込みに失敗しました');
    img.src = URL.createObjectURL(file);
  }, [setIsArMode, setError]);

  // --- クリック処理 ---
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (xrSession) {
        setIsTapping(true);
      } else {
        if (canvas2dRef.current) {
          const rect = canvas2dRef.current.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          addPoint({ x, y });
        }
      }
    },
    [xrSession, addPoint]
  );

  // --- 3D距離計算（AR） ---
  useEffect(() => {
    if (points3d.length === 2) {
      const distanceMeters = calculate3dDistance(points3d[0], points3d[1]);
      const distanceMm = distanceMeters * 1000;
      if (isDistanceExceeded(distanceMm)) {
        setArError('10mを超える計測は非対応');
        setTimeout(() => {
          clearPoints();
          setArError(null);
        }, 3000);
      } else {
        setMeasurement({
          mode: 'furniture',
          measurementMethod: 'ar',
          valueMm: distanceMm,
          unit,
          dateISO: new Date().toISOString(),
        });
      }
    }
  }, [points3d, setMeasurement, unit, clearPoints, setArError]);

  // --- 2D距離計算（フォールバック） ---
  useEffect(() => {
    if (points.length === 2 && scale?.mmPerPx) {
      const distance = calculate2dDistance(points[0], points[1], scale.mmPerPx);
      setMeasurement({
        mode: 'furniture',
        measurementMethod: 'fallback',
        valueMm: distance,
        unit,
        dateISO: new Date().toISOString(),
      });
    }
  }, [points, scale, setMeasurement, unit]);

  // --- 2D描画 ---
  useEffect(() => {
    if (xrSession) return;
    const canvas = canvas2dRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length === 2 && useMeasureStore.getState().measurement) {
      const { measurement } = useMeasureStore.getState();
      drawMeasurementLine(ctx, points[0], points[1]);
      const labelPos = {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2,
      };
      const formatted = formatMeasurement(measurement!.valueMm!, measurement!.unit);
      drawMeasurementLabel(ctx, formatted, labelPos.x, labelPos.y);
    }
  }, [points, xrSession]);

  // --- ARレンダーループ ---
  useEffect(() => {
    console.log('MeasurePage useEffect for AR render loop:', {
      xrSession,
      rendererRef: rendererRef.current,
      sceneRef: sceneRef.current,
      cameraRef: cameraRef.current,
    });
    if (!xrSession || !rendererRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);
    reticleRef.current = reticle;

    let hitTestSource: XRHitTestSource | null = null;

    (async () => {
      const currentSession = renderer.xr.getSession();
      if (!currentSession) return;
      try {
        const viewerSpace = await currentSession.requestReferenceSpace('viewer');
        // @ts-expect-error - hit test may be experimental
        const source = await currentSession.requestHitTestSource?.({ space: viewerSpace });
        if (source) {
          hitTestSource = source;
          console.log('Hit test source requested successfully.');
        }
      } catch (e) {
        console.error('Failed to request hit test source:', e);
      }
    })();

    if (process.env.NODE_ENV === 'development') {
      setIsPlaneDetected(true);
      reticle.matrix.identity();
      reticle.matrix.makeTranslation(0, 0, -1.0);
      reticle.visible = true;
    }

    const renderLoop = createRenderLoop({
      scene,
      camera,
      renderer,
      reticleRef,
      hitTestSource,
      setIsPlaneDetected,
      isTapping,
      points3d,
      addPoint3d,
      clearPoints,
      initialPrevTime: performance.now(),
    });

    renderer.setAnimationLoop(renderLoop);

    return () => {
      if (reticleRef.current) scene.remove(reticleRef.current);
      renderer.setAnimationLoop(null);
    };
  }, [xrSession, isTapping, addPoint3d, clearPoints, points3d, setIsPlaneDetected]);

  // --- 3Dライン描画 ---
  useEffect(() => {
    const scene = sceneRef.current;
    if (lineRef.current) {
      scene.remove(lineRef.current);
      lineRef.current = null;
    }
    if (points3d.length === 2) {
      const geom = new THREE.BufferGeometry().setFromPoints(
        points3d.map((p) => new THREE.Vector3(p.x, p.y, p.z))
      );
      const mat = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 10 });
      const line = new THREE.Line(geom, mat);
      lineRef.current = line;
      scene.add(line);
    }
  }, [points3d]);

  // --- WebGLレンダラ初期化 ---
  const ensureRenderer = useCallback(() => {
    if (rendererRef.current) return rendererRef.current;
    const canvas = canvasWebGLRef.current!;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    const cam = cameraRef.current;
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    (renderer as any).__cleanup = () => window.removeEventListener('resize', onResize);
    rendererRef.current = renderer;
    return renderer;
  }, []);

  // --- ARセッション開始 ---
  const startARSession = useCallback(async () => {
    try {
      const supported = await isWebXRAvailable();
      setIsWebXrSupported(!!supported);
      if (!supported) {
        setIsArMode(false);
        setError('このブラウザではWebXR（AR）がサポートされていません。通常計測に切り替えます。');
        return;
      }

      const xr: any = (navigator as any).xr;
      if (!xr || typeof xr.requestSession !== 'function') {
        setIsArMode(false);
        setError('WebXR API を利用できません。');
        return;
      }

      const renderer = ensureRenderer();
      const sessionInit: XRSessionInit = {
        requiredFeatures: ['hit-test', 'local-floor'] as any,
        optionalFeatures: ['dom-overlay', 'unbounded'] as any,
        // @ts-expect-error overlay root
        domOverlay: { root: document.body },
      };

      const session: XRSession = await xr.requestSession('immersive-ar', sessionInit);
      await (renderer as any).xr.setSession(session);

      setXrSession(session);
      setIsArMode(true);
      setError(null);
      setArError(null);

      session.addEventListener('end', () => {
        setXrSession(null);
        setIsArMode(false);
        const r = rendererRef.current;
        if (r && (r as any).__cleanup) (r as any).__cleanup();
        console.log('XR session ended');
      });
    } catch (e: any) {
      console.error('startARSession failed:', e);
      setIsArMode(false);
      setXrSession(null);
      setError(e?.message ?? 'ARセッションの開始に失敗しました。');
    }
  }, [ensureRenderer, setIsWebXrSupported, setIsArMode, setError, setXrSession, setArError]);

  // --- isArModeがtrueなら自動で開始 ---
  useEffect(() => {
    const { isArMode } = useMeasureStore.getState();
    if (isArMode && !xrSession) startARSession();
  }, [xrSession, startARSession]);

  // WebXR サポートの簡易可否（UIの有効/無効表示用）
  const isArSupported = typeof (navigator as any).xr !== 'undefined';

  return (
    <div
      data-testid="measure-page-container"
      className="relative w-full h-screen"
      onClick={handleCanvasClick}
    >
      {stream && !globalError && (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
          autoPlay
          muted
          playsInline
        />
      )}
      {isArMode ? (
        <canvas
          ref={canvasWebGLRef}
          data-testid="measure-canvas-webgl"
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      ) : (
        <canvas
          ref={canvas2dRef}
          data-testid="measure-canvas-2d"
          className="absolute top-0 left-0 w-full h-full z-0"
        />
      )}

      <MeasureUIComponent
        onStartARSession={startARSession}
        onToggleCameraFacingMode={toggleCameraFacingMode}
        onCapturePhoto={onCapturePhoto}     // ← 追加
        onPickPhoto={onPickPhoto}           // ← 追加
        isArSupported={isArSupported}       // ← 追加
      />

      {/* 隠しファイル入力（写真選択用） */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onPhotoSelected}
      />
    </div>
  );
};

export default MeasurePage;
