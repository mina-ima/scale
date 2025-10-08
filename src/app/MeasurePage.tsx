import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useMeasureStore } from '../store/measureStore';
import { useCamera } from '../core/camera/useCamera';
import { isWebXRAvailable } from '../core/ar/webxrUtils';

const MeasurePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20));
  const lineRef = useRef<THREE.Line | null>(null);
  const [isTapping, setIsTapping] = useState(false);

  const {
    points3d,
    addPoint3d,
    clearPoints,
    setIsArMode,
    setIsPlaneDetected,
    setArError,
    setFacingMode,
  } = useMeasureStore();

  const { stream, startCamera, toggleCameraFacingMode, facingMode } = useCamera();

  useEffect(() => {
    setFacingMode(facingMode);
  }, [facingMode, setFacingMode]);

  // Listen for external command to toggle camera
  useEffect(() => {
      const unsubscribe = useMeasureStore.subscribe(
          (state, prevState) => {
              if (state.cameraToggleRequested && !prevState.cameraToggleRequested) {
                  toggleCameraFacingMode();
                  useMeasureStore.setState({ cameraToggleRequested: false });
              }
          }
      );
      return unsubscribe;
  }, [toggleCameraFacingMode]);

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

    try {
      const session = await navigator.xr.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor'],
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
      
      setIsArMode(true);

      session.addEventListener('end', () => {
        renderer.xr.setAnimationLoop(null);
        renderer.dispose();
        rendererRef.current = null;
        setIsArMode(false);
        setIsPlaneDetected(false);
      });
    } catch (error) {
      console.error('AR Error:', error);
      setArError(error instanceof Error ? error.message : String(error));
    }
  }, [setIsArMode, setIsPlaneDetected, setArError]);

  // Listen for external command to start AR
  useEffect(() => {
      const unsubscribe = useMeasureStore.subscribe(
          (state, prevState) => {
              if (state.isArMode && !prevState.isArMode) {
                  startARSession();
              }
          }
      );
      return unsubscribe;
  }, [startARSession]);

  useEffect(() => {
    isWebXRAvailable().then(isSupported => {
        useMeasureStore.setState({ isWebXrSupported: isSupported });
    });
    startCamera();
  }, [startCamera]);

  const handleCanvasClick = useCallback(() => {
    if (useMeasureStore.getState().isArMode) {
      setIsTapping(true);
    }
  }, []);

  useEffect(() => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const isArMode = useMeasureStore.getState().isArMode;

    if (isArMode && renderer) {
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
        if (!frame || !renderer || !renderer.xr.isPresenting) return;

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

      renderer.setAnimationLoop(renderLoop);

      return () => {
        scene.remove(reticle);
        if(rendererRef.current){
            rendererRef.current.setAnimationLoop(null);
        }
      };
    }
  }, [useMeasureStore.getState().isArMode, isTapping, addPoint3d, clearPoints, points3d.length, setIsPlaneDetected]);

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

  return (
    <div className="relative w-full h-screen" onClick={handleCanvasClick}>
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
        autoPlay
        muted
        playsInline
        style={{ display: useMeasureStore.getState().isArMode ? 'none' : 'block' }}
      />
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
    </div>
  );
};

export default MeasurePage;
