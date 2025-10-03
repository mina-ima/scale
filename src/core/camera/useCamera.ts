import { useState, useEffect } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const enableStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        setError(err as Error);
      }
    };

    enableStream();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  return { stream, error };
};
