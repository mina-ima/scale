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