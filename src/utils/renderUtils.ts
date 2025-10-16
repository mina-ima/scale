export function throttleAnimationFrame<T extends (...args: unknown[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let animationFrameId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const throttled = (...args: Parameters<T>): void => {
    lastArgs = args;

    if (animationFrameId === null) {
      animationFrameId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback(...lastArgs);
        }
        animationFrameId = null;
        lastArgs = null;
      });
    }
    // If a frame is already scheduled, do nothing.
    // The scheduled frame will execute with the latest `lastArgs`.
  };

  return throttled;
}
