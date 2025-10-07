import { useState, useCallback, useEffect } from 'react'; // useEffectを追加
import { getCameraStream, stopCameraStream } from './utils'; // utilsからインポート

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // デフォルトはバックカメラ

  const startCamera = useCallback(async () => {
    try {
      // 既存のストリームがあれば停止
      if (stream) {
        stopCameraStream(stream);
      }
      const mediaStream = await getCameraStream(facingMode); // facingModeを渡す
      setStream(mediaStream as MediaStream); // MediaStream | ErrorState の可能性があるのでキャスト
      setError(null);
      return mediaStream;
    } catch (err) {
      setError(err as Error);
      setStream(null);
      return null;
    }
  }, [facingMode, stream]); // facingModeとstreamを依存配列に追加

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
    startCamera();
  }, [facingMode, startCamera]); // facingModeとstartCameraを依存配列に追加

  return { stream, error, startCamera, stopCamera, facingMode, toggleCameraFacingMode };
};
