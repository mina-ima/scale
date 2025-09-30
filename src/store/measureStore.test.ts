import { describe, it, expect, beforeEach } from 'vitest';
import { useMeasureStore } from './measureStore';

describe('useMeasureStore', () => {
  // Reset the store before each test to ensure isolation
  beforeEach(() => {
    useMeasureStore.setState({
      measureMode: 'furniture',
      scale: null,
      error: null,
    });
  });

  it('should have initial state correctly', () => {
    const { measureMode, scale, error } = useMeasureStore.getState();
    expect(measureMode).toBe('furniture');
    expect(scale).toBeNull();
    expect(error).toBeNull();
  });

  it('should set measure mode correctly', () => {
    const { setMeasureMode } = useMeasureStore.getState();
    setMeasureMode('growth-height');
    expect(useMeasureStore.getState().measureMode).toBe('growth-height');
  });

  it('should set scale correctly', () => {
    const { setScale } = useMeasureStore.getState();
    const mockScale: ScaleEstimation = {
      source: 'a4',
      mmPerPx: 0.5,
      confidence: 0.9,
    };
    setScale(mockScale);
    expect(useMeasureStore.getState().scale).toEqual(mockScale);
  });

  it('should set error correctly', () => {
    const { setError } = useMeasureStore.getState();
    const mockError: ErrorState = {
      code: 'CAMERA_DENIED',
      message: 'Camera access denied.',
    };
    setError(mockError);
    expect(useMeasureStore.getState().error).toEqual(mockError);
  });

  it('should clear error correctly', () => {
    const { setError } = useMeasureStore.getState();
    setError(null);
    expect(useMeasureStore.getState().error).toBeNull();
  });
});
