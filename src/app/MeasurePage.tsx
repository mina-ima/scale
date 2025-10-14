import { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useMeasureStore } from '../store/measureStore';
import { calculate3dDistance } from '../core/measure/calculate3dDistance';
import { useCamera } from '../core/camera/useCamera';
import { isWebXRAvailable } from '../core/ar/webxrUtils';
import MeasureUI from './MeasureUI';

const MeasurePage: React.FC = () => {
  console.log("MeasurePage: rendered");
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
    points3d,
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
    cameraToggleRequested,
    setCameraToggleRequested,
  } = useMeasureStore();

  const { stream, startCamera, toggleCameraFacingMode } = useCamera();

  useEffect(() => {
    console.log("MeasurePage: useEffect triggered with stream:", stream);
    if (videoRef.current) {
      console.log("MeasurePage: Current videoRef.current.srcObject:", videoRef.current.srcObject);
      if (stream && videoRef.current.srcObject !== stream) {
        console.log("MeasurePage: Setting videoRef.current.srcObject to new stream.");
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          console.log("MeasurePage: Video stream started successfully.");
        }).catch((e) => {
          console.error("MeasurePage: Error playing video stream:", e);
        });
      } else if (!stream && videoRef.current.srcObject) {
        // ストリームがnullになった場合、srcObjectをクリア
        console.log("MeasurePage: Clearing videoRef.current.srcObject as stream is null.");
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  // Effect to handle camera toggle requests from MeasureUI
  useEffect(() => {
    if (cameraToggleRequested) {
      toggleCameraFacingMode();
      setCameraToggleRequested(false);
    }
  }, [cameraToggleRequested, toggleCameraFacingMode, setCameraToggleRequested]);

  const startARSession = useCallback(async () => {
    const isSupported = await isWebXRAvailable();
    if (!isSupported || !canvasRef.current) {
      setArError('お使いのデバイスはARに対応していません。');
      return;
    }
    setIsArMode(true);

    try {
      const session = await navigator.xr?.requestSession('immersive-ar', {
        requiredFeatures: ['hit-test', 'local-floor'],
        optionalFeatures: ['dom-overlay'],
        domOverlay: { root: document.getElementById('ar-overlay')! },
      });

      if (!session) {
        setArError('ARセッションの開始に失敗しました。');
        setIsArMode(false);
        return;
      }

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

      console.log('import.meta.env.MODE:', import.meta.env.MODE);

      // Debug: Force plane detection in development environment
      if (import.meta.env.MODE === 'development') {
        setIsPlaneDetected(true);
        // Position reticle at a default location for debugging (e.g., near the center of the view)
        if (reticleRef.current) {
          reticleRef.current.matrix.identity();
          reticleRef.current.matrix.makeTranslation(0, 0, -1.0); // Example: 1 meter in front of the camera
          reticleRef.current.visible = true;
        }
      }

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
    const initCamera = async () => {
      const supported = await isWebXRAvailable();
      setIsWebXrSupported(supported); // ここでisWebXrSupportedを設定
      startCamera();
    };
    initCamera();
  }, [startCamera, setIsWebXrSupported]); // setIsWebXrSupported を依存配列に追加

  const handleCanvasClick = useCallback(() => {
    if (xrSession) {
      setIsTapping(true);
    }
  }, [xrSession]);

  useEffect(() => {
    if (points3d.length === 2) {
      const distanceMeters = calculate3dDistance(points3d[0], points3d[1]);
      setMeasurement({
        mode: 'furniture',
        measurementMethod: 'ar',
        valueMm: distanceMeters * 1000,
        unit: unit,
        dateISO: new Date().toISOString(),
      });
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

    const renderLoop = (timestamp: number, frame: XRFrame) => {
      if (!frame || !renderer.xr.isPresenting) return;

      const referenceSpace = renderer.xr.getReferenceSpace();
      if (!referenceSpace) return;

      if (import.meta.env.MODE === 'development') {
        // In development mode, always show reticle if AR session is active
        if (reticleRef.current) {
          reticleRef.current.visible = true;
        }
        setIsPlaneDetected(true);
      } else if (hitTestSource) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(referenceSpace);
          if (pose && reticleRef.current) {
            reticleRef.current.visible = true;
            reticleRef.current.matrix.fromArray(pose.transform.matrix);
            setIsPlaneDetected(true);
            // console.log('Plane detected.'); // Log only when a plane is detected

            if (isTapping) {
              if (reticleRef.current) {
                const currentReticleMesh: THREE.Mesh = reticleRef.current;
                const point = new THREE.Vector3();
                point.setFromMatrixPosition(currentReticleMesh.matrix);
                if (points3d.length >= 2) clearPoints();
                addPoint3d({ x: point.x, y: point.y, z: point.z });
                setIsTapping(false);
              }
            }
          }
        } else {
          if (reticleRef.current) {
            reticleRef.current.visible = false;
          }
          setIsPlaneDetected(false);
          // console.log('No plane detected.'); // Log only when no plane is detected
        }
      }
      // End of else if (hitTestSource) block
      renderer.render(scene, camera);
    };

    renderer.setAnimationLoop(renderLoop);

    return () => {
      if (reticleRef.current) {
        scene.remove(reticleRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.setAnimationLoop(null);
      }
    };
  }, [
    xrSession,
    isTapping,
    addPoint3d,
    clearPoints,
    points3d.length,
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
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <MeasureUI />
    </div>
  );
};

export default MeasurePage;
