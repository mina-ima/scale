import { create } from 'zustand';
import { Point } from '../core/fallback/utils';

export interface MeasureState {
  measureMode: MeasureMode;
  scale: ScaleEstimation | null;
  error: ErrorState | null;
  points: Point[];
  points3d: Point3D[];
  measurement: MeasurementResult | null;
  unit: 'cm' | 'm';
  isArMode: boolean;
  isPlaneDetected: boolean;
  arError: string | null;
  isWebXrSupported: boolean;
  facingMode: 'user' | 'environment';
  setMeasureMode: (mode: MeasureMode) => void;
  setScale: (scale: ScaleEstimation | null) => void;
  setError: (error: ErrorState | null) => void;
  addPoint: (point: Point) => void;
  addPoint3d: (point: Point3D) => void;
  clearPoints: () => void;
  setMeasurement: (measurement: MeasurementResult | null) => void;
  setUnit: (unit: 'cm' | 'm') => void;
  setIsArMode: (isArMode: boolean) => void;
  setIsPlaneDetected: (isPlaneDetected: boolean) => void;
  setArError: (error: string | null) => void;
  toggleCameraFacingMode: () => void;
  setWebXrSupported: (isSupported: boolean) => void;
  setFacingMode: (facingMode: 'user' | 'environment') => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  measureMode: 'furniture', // Default mode
  scale: null,
  error: null,
  points: [],
  points3d: [],
  measurement: null,
  unit: 'cm',
  isArMode: false,
  isPlaneDetected: false,
  arError: null,
  isWebXrSupported: false,
  facingMode: 'environment',
  setMeasureMode: (mode) => set({ measureMode: mode }),
  setScale: (scale) => set({ scale }),
  setError: (error) => set({ error }),
  addPoint: (point) => set((state) => ({ points: [...state.points, point] })),
  addPoint3d: (point) =>
    set((state) => ({ points3d: [...state.points3d, point] })),
  clearPoints: () => set({ points: [], points3d: [], measurement: null }),
  setMeasurement: (measurement) => set({ measurement }),
  setUnit: (unit) => set({ unit }),
  setIsArMode: (isArMode) => set({ isArMode }),
  setIsPlaneDetected: (isPlaneDetected) => set({ isPlaneDetected }),
  setArError: (arError) => set({ arError }),
  toggleCameraFacingMode: () => { console.warn('toggleCameraFacingMode not implemented')},
  setWebXrSupported: (isSupported) => set({ isWebXrSupported: isSupported }),
  setFacingMode: (facingMode) => set({ facingMode }),
}));

// Expose useMeasureStore for Playwright tests
if (typeof window !== 'undefined' && window.isPlaywrightTest) {
  window.useMeasureStore = useMeasureStore;
}
