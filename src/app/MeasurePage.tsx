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
    error: globalError, // Rename to avoid conflict with useCamera error
  } = useMeasureStore();

  console.log('MeasurePage: rendered', { isArMode, globalError });

  const { stream, error: cameraError, toggleCameraFacingMode } = useCamera(); // Rename to avoid conflict with global error

  useEffect(() => {
    // startCamera() は useCamera フックの内部で facingMode の変更に応じて自動的に呼び出される
    // ここでは stream の変更に応じて video 要素を更新する
    console.log('MeasurePage: useEffect triggered with stream:', stream, 'cameraError:', cameraError);
    if (cameraError) {
      setError(cameraError);
      setIsArMode(false);
      return;
    }
    if (videoRef.current) {
      console.log(
        'MeasurePage: Current videoRef.current.srcObject:',
        videoRef.current.srcObject
      );
      if (stream && videoRef.current.srcObject !== stream) {
        console.log(
          'MeasurePage: Setting videoRef.current.srcObject to new stream.'
        );
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
        console.log(
          'MeasurePage: Clearing videoRef.current.srcObject as stream is null.'
        );
        videoRef.current.srcObject = null;
      }
    }
  }, [stream, cameraError, setError, setIsArMode]);

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

  useEffect(() => {
    if (points3d.length === 2) {
      const distanceMeters = calculate3dDistance(points3d[0], points3d[1]);
      const distanceMm = distanceMeters * 1000;
      if (isDistanceExceeded(distanceMm)) {
        setArError('10mを超える計測は非対応');
        setTimeout(() => {
          clearPoints();
          setArError(null);
        }, 3000); // Clear error after 3 seconds
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
        const viewerSpace =
          await currentXrSession.requestReferenceSpace('viewer');

        const source = await currentXrSession.requestHitTestSource?.({
          space: viewerSpace,
        });

        if (source) {
          hitTestSource = source;

          console.log(
            'Hit test source requested successfully.',

            hitTestSource
          );
        } else {
          console.error(
            'requestHitTestSource is not available in this session.'
          );
        }
      } catch (e) {
        console.error('Failed to request hit test source:', e);
      }
    })();

    // Debug: Force plane detection in development environment
    if (process.env.NODE_ENV === 'development') {
      setIsPlaneDetected(true);
      // Position reticle at a default location for debugging (e.g., near the center of the view)
      reticle.matrix.identity();
      reticle.matrix.makeTranslation(0, 0, -1.0); // Example: 1 meter in front of the camera
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
      initialPrevTime: performance.now(), // Pass current time for initialPrevTime
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

  useEffect(() => {
    if (window.isPlaywrightTest) {
      // @ts-expect-error - for testing
      window.testState = { points3dCount: points3d.length };
    }
  }, [points3d]);

  // This effect handles the startARSession call when isArMode becomes true.
  useEffect(() => {
    const { isArMode } = useMeasureStore.getState();
    if (isArMode && !xrSession) {
      startARSession();
    }
  }, [xrSession]);

  return (
    <div
      data-testid="measure-page-container"
      className="relative w-full h-screen"
      onClick={handleCanvasClick}
    >
      {stream && !error && (
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
