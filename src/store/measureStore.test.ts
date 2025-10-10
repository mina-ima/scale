import { useMeasureStore, ErrorState } from './measureStore';
import { ScaleEstimation } from '../core/reference/ScaleEstimation';

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
      mmPerPx: 0.5,
      confidence: 0.9,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    };
    setScale(mockScale);
    expect(useMeasureStore.getState().scale).toEqual(mockScale);
  });

  it('should set error correctly', () => {
    const { setError } = useMeasureStore.getState();
    const mockError: ErrorState = {
      name: 'CameraError',
      title: 'カメラエラー',
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

  it('should clear previous points when adding a third point', () => {
    const { addPoint, addPoint3d, clearPoints } = useMeasureStore.getState();

    // Test for 2D points
    addPoint({ x: 10, y: 20 });
    addPoint({ x: 30, y: 40 });
    expect(useMeasureStore.getState().points).toHaveLength(2);

    addPoint({ x: 50, y: 60 });
    expect(useMeasureStore.getState().points).toHaveLength(1);
    expect(useMeasureStore.getState().points[0]).toEqual({ x: 50, y: 60 });
    expect(useMeasureStore.getState().points3d).toHaveLength(0);

    // Reset for 3D test
    clearPoints();
    expect(useMeasureStore.getState().points).toHaveLength(0);

    // Test for 3D points
    addPoint3d({ x: 1, y: 2, z: 3 });
    addPoint3d({ x: 4, y: 5, z: 6 });
    expect(useMeasureStore.getState().points3d).toHaveLength(2);

    addPoint3d({ x: 7, y: 8, z: 9 });
    expect(useMeasureStore.getState().points3d).toHaveLength(1);
    expect(useMeasureStore.getState().points3d[0]).toEqual({
      x: 7,
      y: 8,
      z: 9,
    });
    expect(useMeasureStore.getState().points).toHaveLength(0);
  });
});
