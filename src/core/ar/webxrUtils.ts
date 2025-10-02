export async function isWebXRAvailable(): Promise<boolean> {
  if (navigator.xr) {
    try {
      return await navigator.xr.isSessionSupported('immersive-ar');
    } catch (error) {
      console.error('Error checking WebXR session support:', error);
      return false;
    }
  }
  return false;
}

export async function startXrSession(): Promise<XRSession | null> {
  if (!navigator.xr) {
    console.error('WebXR not available.');
    return null;
  }

  try {
    const session = await navigator.xr.requestSession('immersive-ar', { optionalFeatures: ['dom-overlay', 'hit-test'] });
    return session;
  } catch (error) {
    console.error('Error requesting XR session:', error);
    return null;
  }
}

export async function initHitTestSource(session: XRSession): Promise<XRHitTestSource | null> {
  try {
    const referenceSpace = await session.requestReferenceSpace('viewer');
    const hitTestSource = await session.requestHitTestSource({ space: referenceSpace });
    return hitTestSource;
  } catch (error) {
    console.error('Error initializing hit test source:', error);
    return null;
  }
}

export function get3dPointFromHitTest(
  frame: XRFrame,
  hitTestSource: XRHitTestSource,
  referenceSpace: XRReferenceSpace
): { x: number; y: number; z: number } | null {
  const hitTestResults = frame.getHitTestResults(hitTestSource);

  if (hitTestResults.length > 0) {
    const pose = hitTestResults[0].getPose(referenceSpace);
    if (pose) {
      return { x: pose.transform.position.x, y: pose.transform.position.y, z: pose.transform.position.z };
    }
  }
  return null;
}

export function detectPlane(frame: XRFrame): boolean {
  if (!frame.detectedPlanes) {
    return false;
  }
  const planes = frame.detectedPlanes;
  for (const plane of planes) {
    if (plane) {
      return true;
    }
  }
  return false;
}

interface Point3D { x: number; y: number; z: number; }

export function stabilizePoint(currentPoint: Point3D, history: Point3D[], historySize: number = 5): Point3D {
  const newHistory = [...history, currentPoint].slice(-historySize);

  const sum = newHistory.reduce((acc, point) => {
    acc.x += point.x;
    acc.y += point.y;
    acc.z += point.z;
    return acc;
  }, { x: 0, y: 0, z: 0 });

  return {
    x: sum.x / newHistory.length,
    y: sum.y / newHistory.length,
    z: sum.z / newHistory.length,
  };
}

export async function handleWebXRFallback(): Promise<boolean> {
  if (!await isWebXRAvailable()) {
    console.warn('WebXR not available, falling back to 2D measurement.');
    return true;
  }

  try {
    const session = await startXrSession();
    if (!session) {
      console.warn('WebXR session failed to start, falling back to 2D measurement.');
      return true;
    }
    // If session starts successfully, it means WebXR is working, so no fallback needed
    return false;
  } catch (error) {
    console.error('Error during WebXR session setup, falling back to 2D measurement:', error);
    return true;
  }
}