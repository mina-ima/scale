import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useMeasureStore } from '../store/measureStore';
import { calculate3dDistance } from '../core/measure/calculate3dDistance';
import { useCamera } from '../core/camera/useCamera';
import { isWebXRAvailable } from '../core/ar/webxrUtils';
import MeasureUI from './MeasureUI';

const MeasurePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20));
  const lineRef = useRef<THREE.Line | null>(null);
  const [isTapping, setIsTapping] = useState(false);

  const {
    points3d, addPoint3d, clearPoints, setMeasurement, unit, xrSession, setXrSession,
    setIsPlaneDetected, setArError, setIsWebXrSupported, setIsArMode
  } = useMeasureStore();

  const { stream, startCamera, facingMode, setFacingMode } = useCamera(useMeasureStore.getState().facingMode);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startARSession = useCallback(async () => {
    const isSupported = await isWebXRAvailable();
    if (!isSupported || !canvasRef.current) {
        setArError('お使いのデバイスはARに対応していません。');
        return;
    }
    setIsArMode(true);

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.getElementById('ar-overlay')! },
      });

      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      rendererRef.current = renderer;

      const referenceSpace = await session.requestReferenceSpace('local-floor');
      renderer.xr.setReferenceSpace(referenceSpace);
      await renderer.xr.setSession(session);
      setXrSession(session);

      session.addEventListener('end', () => {
        renderer.xr.setAnimationLoop(null);
        renderer.dispose();
        rendererRef.current = null;
        setXrSession(null);
        setIsPlaneDetected(false);
        setIsArMode(false);
      });
    } catch (error) {
      console.error('AR Error:', error);
      setArError(error instanceof Error ? error.message : String(error));
      setIsArMode(false);
    }
  }, [setArError, setIsArMode, setIsPlaneDetected, setXrSession]);

  useEffect(() => {
    isWebXRAvailable().then(setIsWebXrSupported);
    startCamera();
  }, [startCamera, setIsWebXrSupported]);

  const handleCanvasClick = useCallback(() => {
    if (xrSession) {
      setIsTapping(true);
    }
  }, [xrSession]);

  useEffect(() => {
    if (points3d.length === 2) {
      const distanceMeters = calculate3dDistance(points3d[0], points3d[1]);
      setMeasurement({ mode: 'ar', valueMm: distanceMeters * 1000, unit: unit, dateISO: new Date().toISOString() });
    }
  }, [points3d, setMeasurement, unit]);

  useEffect(() => {
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

    let hitTestSource: XRHitTestSource | null = null;
    renderer.xr.getSession()?.requestReferenceSpace('viewer').then(viewerSpace => {
        renderer.xr.getSession()?.requestHitTestSource({ space: viewerSpace }).then(source => {
            hitTestSource = source;
        });
    });

    const renderLoop = (timestamp: number, frame: XRFrame) => {
      if (!frame || !renderer.xr.isPresenting) return;

      const referenceSpace = renderer.xr.getReferenceSpace();
      if (!referenceSpace) return;

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
              if (points3d.length >= 2) clearPoints();
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

    renderer.setAnimationLoop(renderLoop);

    return () => {
      scene.remove(reticle);
      if (rendererRef.current) {
          rendererRef.current.setAnimationLoop(null);
      }
    };
  }, [xrSession, isTapping, addPoint3d, clearPoints, points3d.length, setIsPlaneDetected]);

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

  // This effect handles the startARSession call when isArMode becomes true.
  useEffect(() => {
    const { isArMode } = useMeasureStore.getState();
    if (isArMode && !xrSession) {
      startARSession();
    }
  }, [xrSession, startARSession]);

  return (
    <div className="relative w-full h-screen" onClick={handleCanvasClick}>
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        autoPlay
        muted
        playsInline
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <MeasureUI />
    </div>
  );
};

export default MeasurePage;