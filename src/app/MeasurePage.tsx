import { useState, useEffect, useRef, useCallback } from 'react';
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
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(
    new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    )
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
    error: globalError, // グローバルエラー（useCameraのerrorと名前衝突回避）
  } = useMeasureStore();

  console.log('MeasurePage: rendered', { isArMode, globalError });

  const { stream, error: cameraError, toggleCameraFacingMode } = useCamera();

  // --- カメラストリームの反映 ---
  useEffect(() => {
    console.log('MeasurePage: useEffect triggered with stream:', stream, 'cameraError:', cameraError);
    if (cameraError) {
      setError(cameraError);
      setIsArMode(false);
      return;
    }
    if (videoRef.current) {
      console.log('MeasurePage: Current videoRef.current.srcObject:', videoRef.current.srcObject);
      if (stream && videoRef.current.srcObject !== stream) {
        console.log('MeasurePage: Setting videoRef.current.srcObject to new stream.');
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .then(() => {
            console.log('MeasurePage: Video stream started successfully.');
          })
          .catch((e) => {
            console.error('MeasurePage: Error playing video stream:', e);
          });
      } else if (!stream && videoRef.current.srcObject) {
        // ストリームがnullになった場合、srcObjectをクリア
        console.log('MeasurePage: Clearing videoRef.current.srcObject as stream is null.');
        // @ts-expect-error - srcObject は null を受け取れる
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, cameraError, setError, setIsArMode]);

  // --- 2D/AR のクリック処理 ---
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
          unit: unit,
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
        unit: unit,
        dateISO: new Date().toISOString(),
      });
    }
  }, [points, scale, setMeasurement, unit]);

  // --- 2D描画（フォールバック） ---
  useEffect(() => {
    if (xrSession) return; // Only run in fallback mode

    const canvas = canvas2dRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Clear canvas before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length === 2 && useMeasureStore.getState().measurement) {
      const { measurement } = useMeasureStore.getState();
      drawMeasurementLine(context, points[0], points[1]);
      const labelPosition = {
        x: (points[0].x + points[1].x) / 2,
        y: (points[0].y + points[1].y) / 2,
      };
      const formatted = formatMeasurement(
        measurement!.valueMm!,
        measurement!.unit
      );
      drawMeasurementLabel(
        context,
        formatted,
        labelPosition.x,
        labelPosition.y
      );
    }
  }, [points, xrSession]);

  // --- ARレンダーループ ---
  useEffect(() => {
    console.log('MeasurePage useEffect for AR render loop:', { xrSession, rendererRef: rendererRef.current, sceneRef: sceneRef.current, cameraRef: cameraRef.current });
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
      const currentXrSession = renderer.xr.getSession();
      if (!currentXrSession) return;

      try {
        const viewerSpace = await currentXrSession.requestReferenceSpace('viewer' as XRReferenceSpaceType);
        // @ts-expect-error - requestHitTestSource は型が環境依存
        const source = await currentXrSession.requestHitTestSource?.({ space: viewerSpace });
        if (source) {
          hitTestSource = source as XRHitTestSource;
          console.log('Hit test source requested successfully.', hitTestSource);
        } else {
          console.error('requestHitTestSource is not available in this session.');
        }
      } catch (e) {
        console.error('Failed to request hit test source:', e);
      }
    })();

    // Debug: 強制プレーン検出（開発時のみ）
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

    const currentRenderer = rendererRef.current;
    return () => {
      if (reticleRef.current) {
        scene.remove(reticleRef.current);
      }
      if (currentRenderer) {
        currentRenderer.setAnimationLoop(null);
      }
    };
  }, [
    xrSession,
    isTapping,
    addPoint3d,
    clearPoints,
    points3d,
    setIsPlaneDetected,
  ]);

  // --- 3Dライン表示 ---
  useEffect(() => {
    const scene = sceneRef.current;
    if (lineRef.current) {
      scene.remove(lineRef.current);
      lineRef.current = null;
    }
    if (points3d.length === 2) {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        points3d.map((p) => new THREE.Vector3(p.x, p.y, p.z))
      );
      const material = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        linewidth: 10,
      });
      const line = new THREE.Line(geometry, material);
      lineRef.current = line;
      scene.add(line);
    }
  }, [points3d]);

  // --- Playwright用のテストフック ---
  useEffect(() => {
    if (window.isPlaywrightTest) {
      // @ts-expect-error - for testing
      window.testState = { points3dCount: points3d.length };
    }
  }, [points3d]);

  // --- WebGLレンダラの用意 ---
  const ensureRenderer = useCallback(() => {
    if (rendererRef.current) return rendererRef.current;

    const canvas = canvasWebGLRef.current!;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
    });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    // カメラのアスペクト更新
    const cam = cameraRef.current;
    cam.aspect = window.innerWidth / window.innerHeight;
    cam.updateProjectionMatrix();

    // リサイズ対応
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // クリーンアップ（セッションend時にも呼ばれる）
    const cleanup = () => {
      window.removeEventListener('resize', onResize);
    };
    // @ts-expect-error - stash cleanup
    (renderer as any).__cleanup = cleanup;

    rendererRef.current = renderer;
    return renderer;
  }, []);

  // --- ARセッション開始（未定義だった関数をローカル実装） ---
  const startARSession = useCallback(async () => {
    try {
      // 機能検出（Safari/macOS は通常 false）
      const supported = await isWebXRAvailable();
      setIsWebXrSupported(!!supported);

      if (!supported) {
        setIsArMode(false);
        setError('このブラウザでは WebXR（AR）がサポートされていません。通常計測に切り替えます。');
        return;
      }

      const xr: any = (navigator as any).xr;
      if (!xr || typeof xr.requestSession !== 'function') {
        setIsArMode(false);
        setError('WebXR API を利用できません。');
        return;
      }

      // レンダラの用意
      const renderer = ensureRenderer();

      // セッション取得
      const sessionInit: XRSessionInit = {
        requiredFeatures: ['hit-test', 'local-floor'] as any,
        optionalFeatures: ['dom-overlay', 'unbounded'] as any,
        // @ts-expect-error - domOverlay型は環境依存
        domOverlay: { root: document.body },
      };

      const session: XRSession = await xr.requestSession('immersive-ar', sessionInit);
      // three.js にセッションを紐付け
      await (renderer as any).xr.setSession(session);

      // ストア更新
      setXrSession(session);
      setIsArMode(true);
      setError(null);
      setArError(null);

      // セッション終了時のクリーンアップ
      const onEnd = () => {
        setXrSession(null);
        setIsArMode(false);
        const r = rendererRef.current;
        if (r && (r as any).__cleanup) {
          (r as any).__cleanup();
        }
        console.log('XR session ended');
      };
      session.addEventListener('end', onEnd);
    } catch (e: any) {
      console.error('startARSession failed:', e);
      setIsArMode(false);
      setXrSession(null);
      setError(e?.message ?? 'ARセッションの開始に失敗しました。');
    }
  }, [ensureRenderer, setIsWebXrSupported, setIsArMode, setError, setXrSession, setArError]);

  // --- isArMode が true になったら自動的に AR を開始 ---
  useEffect(() => {
    const { isArMode } = useMeasureStore.getState();
    if (isArMode && !xrSession) {
      // 以前は未定義関数を呼んでいた箇所を修正
      startARSession();
    }
  }, [xrSession, startARSession]);

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
      />
    </div>
  );
};

export default MeasurePage;
