import { useState, useCallback, useEffect, useRef } from 'react';
import { getCameraStream, stopCameraStream } from './utils';
import { ErrorState } from '../../store/measureStore';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // 参照を同期（外部からの即時参照用）
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);
  const facingModeRef = useRef(facingMode);
  useEffect(() => {
    facingModeRef.current = facingMode;
  }, [facingMode]);

  // 現在の facingMode でカメラを起動（既存のものがあれば止めてから）
  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        stopCameraStream(streamRef.current);
      }
      const result = await getCameraStream(facingModeRef.current);
      if (result && 'id' in result) {
        setStream(result as MediaStream);
        setError(null);
        return result;
      } else {
        setError(result as ErrorState);
        setStream(null);
        return null;
      }
    } catch (err) {
      setError({
        name: 'CameraError',
        title: 'カメラエラー',
        message: (err as Error).message,
      } as ErrorState);
      setStream(null);
      return null;
    }
  }, []); // 依存は参照を使うので空配列でOK

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      setStream(null);
    }
  }, []);

  // ★ ここを修正：切替を即時反映（停止→次モードで起動）
  const toggleCameraFacingMode = useCallback(async () => {
    // 次モードを決定（最新は ref から）
    const nextMode: 'user' | 'environment' =
      facingModeRef.current === 'user' ? 'environment' : 'user';

    // 状態は先に更新（UI表示用）
    setFacingMode(nextMode);

    // 既存ストリーム停止
    if (streamRef.current) {
      stopCameraStream(streamRef.current);
      setStream(null);
    }

    // 次モードで取得
    try {
      const result = await getCameraStream(nextMode);
      if (result && 'id' in result) {
        setStream(result as MediaStream);
        setError(null);
      } else {
        setError(result as ErrorState);
        setStream(null);
      }
    } catch (err) {
      setError({
        name: 'CameraError',
        title: 'カメラエラー',
        message: (err as Error).message,
      } as ErrorState);
      setStream(null);
    }
  }, []);

  return {
    stream,
    error,
    startCamera,
    stopCamera,
    facingMode,
    toggleCameraFacingMode,
  };
};
