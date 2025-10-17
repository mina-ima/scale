import { ErrorState } from '../../store/measureStore';

export const getCameraStream = async (
  facingMode: 'user' | 'environment' | undefined = 'environment'
): Promise<MediaStream | ErrorState> => {
  try {
    if (!navigator.mediaDevices) {
      return {
        name: 'CameraError',
        title: 'カメラ非対応',
        code: 'CAMERA_UNAVAILABLE',
        message: 'MediaDevices API is not available in this environment.',
      };
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
    });
    return stream;
  } catch (error) {
    console.error('getCameraStream: Raw error object:', error); // Add this line
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      return {
        name: 'CameraError',
        title: 'カメラアクセス拒否',
        code: 'CAMERA_DENIED',
        message: 'Camera access denied.',
      };
    } else if (error instanceof Error) {
      return {
        name: 'CameraError',
        title: '不明なカメラエラー',
        code: 'UNKNOWN',
        message: `Failed to get camera stream: ${error.message}`,
      };
    } else {
      return {
        name: 'CameraError',
        title: '不明なカメラエラー',
        code: 'UNKNOWN',
        message: 'Failed to get camera stream: An unknown error occurred.',
      };
    }
  }
};

export const stopCameraStream = (
  stream: MediaStream | null | undefined
): void => {
  if (stream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }
};
