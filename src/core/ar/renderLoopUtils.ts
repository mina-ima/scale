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

          const renderLoop = (timestamp: number, frame: XRFrame) => {

            frameCount++;

            const currentTime = performance.now();

            const deltaTime = currentTime - prevTime;

      

            if (deltaTime >= 1000) {

              // Update FPS every second

              const fps = Math.round((frameCount * 1000) / deltaTime);

              console.log(`FPS: ${fps}`);

              frameCount = 0;

              prevTime = currentTime;

            }  };
  return renderLoop;
};
