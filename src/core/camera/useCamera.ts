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
    console.log('useCamera: streamRef.current updated to', stream);
    streamRef.current = stream;
  }, [stream]);

  const facingModeRef = useRef(facingMode);
  useEffect(() => {
    facingModeRef.current = facingMode;
  }, [facingMode]);

  const startCamera = useCallback(async () => {
    console.log('useCamera: startCamera called with mode:', facingModeRef.current);
    try {
      if (streamRef.current) {
        console.log(
          'useCamera: Attempting to stop existing stream. ID:',
          streamRef.current.id
        );
        stopCameraStream(streamRef.current);
        console.log(
          'useCamera: Existing stream stopped. ID:',
          streamRef.current.id
        );
      }
      const result = await getCameraStream(facingModeRef.current);

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
  }, []); // 依存配列を空にして関数を安定化

  const stopCamera = useCallback(() => {
    console.log('useCamera: stopCamera called.');
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      setStream(null);
      console.log('useCamera: Stream stopped and set to null.');
    }
  }, []); // streamへの依存を削除し、関数を安定化

  const toggleCameraFacingMode = useCallback(() => {
    console.log(
      'useCamera: toggleCameraFacingMode called. Current facingMode:',
      facingMode
    );
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  }, [facingMode]);

  return {
    stream,
    error,
    startCamera,
    stopCamera,
    facingMode,
    toggleCameraFacingMode,
  };
};
