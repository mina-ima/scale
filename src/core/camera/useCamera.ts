import { useState, useCallback, useEffect } from 'react'; // useEffectを追加
import { getCameraStream, stopCameraStream } from './utils'; // utilsからインポート

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // デフォルトはバックカメラ

  const startCamera = useCallback(async () => {
    console.log('useCamera: startCamera called. facingMode:', facingMode); // 追加
    try {
      // 既存のストリームがあれば停止
      if (stream) {
        stopCameraStream(stream);
        console.log('useCamera: Existing stream stopped. ID:', stream.id); // 追加
      }
      const mediaStream = await getCameraStream(facingMode); // facingModeを渡す
      setStream(mediaStream as MediaStream); // MediaStream | ErrorState の可能性があるのでキャスト
      console.log('useCamera: New stream set. ID:', (mediaStream as MediaStream)?.id); // 追加
      setError(null);
      return mediaStream;
    } catch (err) {
      setError(err as Error);
      setStream(null);
      console.error('useCamera: Error starting camera:', err); // 追加
      return null;
    }
  }, [facingMode]); // facingModeのみに依存

  const stopCamera = useCallback(() => {
    if (stream) {
      stopCameraStream(stream);
      setStream(null);
    }
  }, [stream]);

  const toggleCameraFacingMode = useCallback(() => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  }, []);

  // facingModeが変更されたらカメラを再起動
  useEffect(() => {
    console.log('useCamera: useEffect triggered. facingMode:', facingMode); // 追加
    startCamera();
  }, [facingMode, startCamera]); // facingModeとstartCameraを依存配列に追加

  return { stream, error, startCamera, stopCamera, facingMode, toggleCameraFacingMode };
};
