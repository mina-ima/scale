export const supportsWebXR = (): boolean => {
  return 'xr' in navigator;
};

export const startXrSession = async (): Promise<XRSession | null> => {
  if (!supportsWebXR()) {
    console.warn('WebXR not supported.');
    return null;
  }

  try {
    const session = await navigator.xr!.requestSession('immersive-ar', {
      optionalFeatures: ['dom-overlay', 'hit-test'],
    });
    return session;
  } catch (error) {
    console.error('Failed to start XR session:', error);
    return null;
  }
};

export const endXrSession = (session: XRSession | null | undefined): void => {
  if (session) {
    session.end();
  }
};

export const initHitTestSource = async (
  session: XRSession
): Promise<XRHitTestSource | null> => {
  try {
    const referenceSpace = await session.requestReferenceSpace('viewer');
    if (!session.requestHitTestSource) {
      console.warn('session.requestHitTestSource is not available.');
      return null;
    }
    const hitTestSource = await session.requestHitTestSource({
      space: referenceSpace,
    });
    return hitTestSource || null;
  } catch (error) {
    console.error('Failed to initialize hit test source:', error);
    return null;
  }
};

export const getHitTestResult = (
  frame: XRFrame,
  hitTestSource: XRHitTestSource,
  referenceSpace: XRReferenceSpace
): { x: number; y: number; z: number } | null => {
  const hitTestResults = frame.getHitTestResults(hitTestSource);

  if (hitTestResults.length > 0) {
    const hit = hitTestResults[0];
    const pose = hit.getPose(referenceSpace);
    if (pose) {
      const position = pose.transform.position;
      if (position) {
        return { x: position.x, y: position.y, z: position.z };
      }
    }
  }
  return null;
};

export const hasDetectedPlane = (frame: XRFrame): boolean => {
  // detectedPlanes is an XRPlaneSet, which is iterable
  // Check if it has any elements
  return !!frame.detectedPlanes && frame.detectedPlanes.size > 0;
};

export const getSmoothedPosition = (
  positions: { x: number; y: number; z: number }[]
): { x: number; y: number; z: number } | null => {
  if (positions.length === 0) {
    return null;
  }

  const sum = positions.reduce(
    (acc, pos) => ({
      x: acc.x + pos.x,
      y: acc.y + pos.y,
      z: acc.z + pos.z,
    }),
    { x: 0, y: 0, z: 0 }
  );

  return {
    x: sum.x / positions.length,
    y: sum.y / positions.length,
    z: sum.z / positions.length,
  };
};
