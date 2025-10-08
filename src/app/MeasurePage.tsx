import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useMeasureStore } from '../store/measureStore';
import { calculate3dDistance } from '../core/measure/calculate3dDistance';
import { formatMeasurement } from '../core/measure/format';
import { useCamera } from '../core/camera/useCamera';
import { isWebXRAvailable } from '../core/ar/webxrUtils';

const MeasurePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isWebXrSupported, setIsWebXrSupported] = useState(false);

  // WebXR and Three.js state
  const [xrSession, setXrSession] = useState<XRSession | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20));
  const lineRef = useRef<THREE.Line | null>(null);
  const [isTapping, setIsTapping] = useState(false);
  const [isPlaneDetected, setIsPlaneDetected] = useState(false);

  const { points3d, measurement, addPoint3d, clearPoints, setMeasurement, unit } = useMeasureStore();
  const { stream, startCamera, facingMode, toggleCameraFacingMode } = useCamera();

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startARSession = useCallback(async () => {
    if (!isWebXrSupported || !canvasRef.current) return;
    if (xrSession) return;

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test'],
      });

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      rendererRef.current = renderer;

      await renderer.xr.setSession(session);
      setXrSession(session);

      session.addEventListener('end', () => {
        renderer.xr.enabled = false;
        renderer.dispose();
        rendererRef.current = null;
        setXrSession(null);
        setIsPlaneDetected(false);
      });
    } catch (error) {
      console.error('AR Error:', error);
    }
  }, [isWebXrSupported, xrSession]);

  useEffect(() => {
    isWebXRAvailable().then(setIsWebXrSupported);
    startCamera();
  }, [startCamera]);

  const handleCanvasClick = useCallback(() => {
    if (xrSession) {
      setIsTapping(true);
    }
  }, [xrSession]);

  useEffect(() => {
    if (points3d.length === 2) {
      const distanceMeters = calculate3dDistance(points3d[0], points3d[1]);
      setMeasurement({
        mode: 'ar',
        valueMm: distanceMeters * 1000,
        unit: unit,
        dateISO: new Date().toISOString(),
      });
    }
  }, [points3d, setMeasurement, unit]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;

    if (xrSession && renderer) {
      const reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial()
      );
      reticle.matrixAutoUpdate = false;
      reticle.visible = false;
      scene.add(reticle);

      let hitTestSource: XRHitTestSource | null = null;
      let hitTestSourceRequested = false;

      const renderLoop = (timestamp: number, frame: XRFrame) => {
        if (!frame) return;
        const session = renderer.xr.getSession();
        if (!session) return;
        session.requestAnimationFrame(renderLoop);
        const referenceSpace = renderer.xr.getReferenceSpace();
        if (!referenceSpace) return;

        if (!hitTestSourceRequested) {
          session.requestReferenceSpace('viewer').then((refSpace) => {
            session.requestHitTestSource({ space: refSpace }).then((source) => {
              hitTestSource = source;
            });
          });
          hitTestSourceRequested = true;
        }

        if (hitTestSource) {
          const hitTestResults = frame.getHitTestResults(hitTestSource);
          if (hitTestResults.length > 0) {
            const hit = hitTestResults[0];
            const pose = hit.getPose(referenceSpace);
            if (pose) {
              reticle.visible = true;
              reticle.matrix.fromArray(pose.transform.matrix);
              setIsPlaneDetected(true);

              if (isTapping) {
                const point = new THREE.Vector3().setFromMatrixPosition(reticle.matrix);
                if (points3d.length >= 2) {
                  clearPoints();
                }
                addPoint3d({ x: point.x, y: point.y, z: point.z });
                setIsTapping(false);
              }
            }
          } else {
            reticle.visible = false;
            setIsPlaneDetected(false);
          }
        }
        renderer.render(scene, camera);
      };
      session.requestAnimationFrame(renderLoop);

      return () => {
        scene.remove(reticle);
      };
    }
  }, [xrSession, isTapping, addPoint3d, clearPoints, points3d.length]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (lineRef.current) {
      scene.remove(lineRef.current);
      lineRef.current = null;
    }
    if (points3d.length === 2) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points3d.map(p => new THREE.Vector3(p.x, p.y, p.z)));
      const material = new THREE.LineBasicMaterial({ color: 0xff00ff, linewidth: 10 });
      const line = new THREE.Line(geometry, material);
      lineRef.current = line;
      scene.add(line);
    }
  }, [points3d]);

  const getInstructionText = () => {
    if (!xrSession) return null;
    if (!isPlaneDetected) return "AR: デバイスを動かして周囲の平面を検出してください。";
    if (points3d.length === 0) return "AR: 平面が検出されました。計測の始点をタップしてください。";
    if (points3d.length === 1) return "AR: 計測の終点をタップしてください。";
    return null;
  };

  return (
    <div className="relative w-full h-screen" onClick={handleCanvasClick}>
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        style={{ display: xrSession ? 'none' : 'block' }}
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded">
        <h1 className="text-xl font-bold">計測モード</h1>
        <p className="text-orange-500 text-sm mb-2">{getInstructionText()}</p>
        {measurement?.valueMm && (
          <p className="text-lg">{formatMeasurement(measurement.valueMm, unit)}</p>
        )}
        {isWebXrSupported && !xrSession && (
          <button
            className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={(e) => { e.stopPropagation(); startARSession(); }}
          >
            AR計測を開始
          </button>
        )}
        {!xrSession && (
            <button
                className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={(e) => { e.stopPropagation(); toggleCameraFacingMode(); }}
            >
                カメラ切り替え ({facingMode === 'user' ? 'インカメラ' : 'アウトカメラ'})
            </button>
        )}
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={(e) => { e.stopPropagation(); clearPoints(); }}
        >
          リセット
        </button>
      </div>
    </div>
  );
};

export default MeasurePage;
