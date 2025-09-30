export const supportsWebXR = (): boolean => {
  return 'xr' in navigator;
};
