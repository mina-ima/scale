import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { throttleAnimationFrame } from './renderUtils';

describe('throttleAnimationFrame', () => {
  let mockCallback: vi.Mock;
  let requestAnimationFrameSpy: vi.SpyInstance;
  let cancelAnimationFrameSpy: vi.SpyInstance;

  beforeEach(() => {
    mockCallback = vi.fn();
    requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should call the callback at most once per animation frame', () => {
    const throttledCallback = throttleAnimationFrame(mockCallback);

    // Call multiple times within a short period
    throttledCallback();
    throttledCallback();
    throttledCallback();

    // Expect requestAnimationFrame to be called once
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
    expect(mockCallback).not.toHaveBeenCalled();

    // Simulate the animation frame
    const animationFrameCallback = requestAnimationFrameSpy.mock.calls[0][0];
    animationFrameCallback(0); // Pass a dummy timestamp

    // Expect the callback to have been called once
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Call again after the frame has passed
    throttledCallback();
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);

    const secondAnimationFrameCallback =
      requestAnimationFrameSpy.mock.calls[1][0];
    secondAnimationFrameCallback(0);
    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  it('should pass arguments to the throttled function', () => {
    const throttledCallback = throttleAnimationFrame(mockCallback);
    const arg1 = 'test';
    const arg2 = 123;

    throttledCallback(arg1, arg2);

    const animationFrameCallback = requestAnimationFrameSpy.mock.calls[0][0];
    animationFrameCallback(0);

    expect(mockCallback).toHaveBeenCalledWith(arg1, arg2);
  });

  it('should not cancel any pending animation frame when called again before the frame, but update arguments', () => {
    const throttledCallback = throttleAnimationFrame(mockCallback);

    throttledCallback('first call'); // First call schedules a frame
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled(); // Should not be called

    throttledCallback('second call'); // Second call should not cancel, just update args
    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled(); // Still should not be called
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(1); // Still only one requestAnimationFrame

    const animationFrameCallback = requestAnimationFrameSpy.mock.calls[0][0];
    animationFrameCallback(0);
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('second call'); // Should be called with the latest arguments
  });

  it('should not call the callback if no animation frame occurs', () => {
    const throttledCallback = throttleAnimationFrame(mockCallback);
    throttledCallback();
    expect(mockCallback).not.toHaveBeenCalled();
  });
});
