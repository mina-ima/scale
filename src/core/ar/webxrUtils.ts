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
