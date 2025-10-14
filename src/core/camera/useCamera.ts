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

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    console.log('useCamera: startCamera called with mode:', mode);
    try {
      if (streamRef.current) {
        console.log('useCamera: Attempting to stop existing stream. ID:', streamRef.current.id);
        stopCameraStream(streamRef.current);
        console.log('useCamera: Existing stream stopped. ID:', streamRef.current.id);
      }
      const result = await getCameraStream(mode);

      if (result && 'id' in result) {
        setStream(result as MediaStream);
        console.log('useCamera: New stream set. ID:', (result as MediaStream).id);
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
  }, []); // 依存配列からfacingModeを削除

  const stopCamera = useCallback(() => {
    console.log('useCamera: stopCamera called.');
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
      console.log('useCamera: Stream stopped and set to null.');
    }
  }, [stream]);

  const toggleCameraFacingMode = useCallback(() => {
    console.log('useCamera: toggleCameraFacingMode called. Current facingMode:', facingMode);
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  }, [facingMode]);

  // facingModeが変更されたらカメラを再起動
  useEffect(() => {
    console.log('useCamera: useEffect triggered. facingMode:', facingMode);
    if (!streamRef.current) { // ストリームがまだ存在しない場合のみstartCameraを呼び出す
      startCamera(facingMode);
    }
    return () => {
      console.log('useCamera: Cleanup function executed. streamRef.current:', streamRef.current);
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
        console.log('useCamera: Stream stopped by cleanup. ID:', streamRef.current.id);
        streamRef.current = null; // クリーンアップ時にnullに設定
      }
    };
  }, [facingMode, startCamera, stream]); // streamを依存配列に追加

  return {
    stream,
    error,
    startCamera: () => startCamera(facingMode), // 外部に公開するstartCameraは現在のfacingModeを使用
    stopCamera,
    facingMode,
    toggleCameraFacingMode,
  };
};
