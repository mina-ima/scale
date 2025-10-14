import { useState, useCallback, useEffect, useRef } from 'react';
import { getCameraStream, stopCameraStream } from './utils';
import { ErrorState } from '../../store/measureStore';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment'
  );

  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  const startCamera = useCallback(async () => {
    console.log('useCamera: startCamera called. facingMode:', facingMode);
    try {
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        console.log(
          'useCamera: Existing stream stopped. ID:',
          streamRef.current.id
        );
      }
      const result = await getCameraStream(facingMode);

      if (result && 'id' in result) {
        setStream(result as MediaStream);
        console.log(
          'useCamera: New stream set. ID:',
          (result as MediaStream).id
        );
        setError(null);
        return result;
      } else {
        setError(result as ErrorState);
        setStream(null);
        console.error('useCamera: Error starting camera:', result);
        return null;
      }
    } catch (err) {
      setError({
        name: 'CameraError',
        title: 'カメラエラー',
        message: (err as Error).message,
      } as ErrorState);
      setStream(null);
      console.error('useCamera: Error starting camera:', err);
      return null;
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
    }
  }, [stream]);

  const toggleCameraFacingMode = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  }, []);

  useEffect(() => {
    console.log('useCamera: useEffect triggered. facingMode:', facingMode);
    startCamera();
    return () => {
      console.log('useCamera: Cleanup on unmount. Stopping stream if exists.');
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }
    };
  }, [facingMode, startCamera]);

  return {
    stream,
    error,
    startCamera,
    stopCamera,
    facingMode,
    toggleCameraFacingMode,
  };
};
