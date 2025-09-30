export const getCameraStream = async (): Promise<MediaStream | ErrorState> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    return stream;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      return {
        code: 'CAMERA_DENIED',
        message: 'Camera access denied.',
      };
    } else if (error instanceof Error) {
      return {
        code: 'UNKNOWN',
        message: `Failed to get camera stream: ${error.message}`,
      };
    } else {
      return {
        code: 'UNKNOWN',
        message: 'Failed to get camera stream: An unknown error occurred.',
      };
    }
  }
};
