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
