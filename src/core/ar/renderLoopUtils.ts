import * as THREE from 'three';
import { useMeasureStore } from '../../store/measureStore';

interface CreateRenderLoopParams {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  reticleRef: React.MutableRefObject<THREE.Mesh | null>;
  hitTestSource: XRHitTestSource | null;
  setIsPlaneDetected: (isDetected: boolean) => void;
  isTapping: boolean;
  points3d: { x: number; y: number; z: number }[];
  addPoint3d: (point: { x: number; y: number; z: number }) => void;
  clearPoints: () => void;
  initialFrameCount?: number;
  initialPrevTime?: number;
}

export const createRenderLoop = ({
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
  initialFrameCount = 0,
  initialPrevTime = performance.now(),
}: CreateRenderLoopParams & { initialFrameCount?: number; initialPrevTime?: number }) => {
  let frameCount = initialFrameCount;
  let prevTime = initialPrevTime;
  let lastRenderTime = performance.now(); // Initialize lastRenderTime with current time

  const renderLoop = (timestamp: number, frame: XRFrame) => {
    frameCount++;
    const currentTime = timestamp;
    const deltaTime = currentTime - prevTime;

    if (deltaTime >= 1000) {
      // Update FPS every second
      const fps = Math.round((frameCount * 1000) / deltaTime);
      console.log(`FPS: ${fps}`);
      frameCount = 0;
      prevTime = currentTime;
    }

    // Rendering logic with throttling
    const MIN_RENDER_INTERVAL = 1000 / 24; // Target 24 FPS

    if (currentTime - lastRenderTime >= MIN_RENDER_INTERVAL) {
      lastRenderTime = currentTime;

      const referenceSpace = renderer.xr.getReferenceSpace();

      if (import.meta.env.MODE === 'development') {
        if (reticleRef.current) {
          reticleRef.current.visible = true;
        }
        setIsPlaneDetected(true);
      } else if (hitTestSource && referenceSpace) {
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(referenceSpace);
          if (pose && reticleRef.current) {
            reticleRef.current.visible = true;
            reticleRef.current.matrix.fromArray(pose.transform.matrix);
            setIsPlaneDetected(true);

            if (isTapping) {
              const currentReticleMesh: THREE.Mesh = reticleRef.current;
              const point = new THREE.Vector3();
              point.setFromMatrixPosition(currentReticleMesh.matrix);
              if (points3d.length >= 2) clearPoints();
              addPoint3d({ x: point.x, y: point.y, z: point.z });
            }
          }
        } else {
          if (reticleRef.current) {
            reticleRef.current.visible = false;
          }
          setIsPlaneDetected(false);
        }
      }
      renderer.render(scene, camera);
    }
  };
  return renderLoop;
};
