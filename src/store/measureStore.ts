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
  setMeasureMode: (mode: MeasureMode) => void;
  setScale: (scale: ScaleEstimation | null) => void;
  setError: (error: ErrorState | null) => void;
  addPoint: (point: Point) => void;
  addPoint3d: (point: Point3D) => void;
  clearPoints: () => void;
  setMeasurement: (measurement: MeasurementResult | null) => void;
  setUnit: (unit: 'cm' | 'm') => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  measureMode: 'furniture', // Default mode
  scale: null,
  error: null,
  points: [],
  points3d: [],
  measurement: null,
  unit: 'cm',
  setMeasureMode: (mode) => set({ measureMode: mode }),
  setScale: (scale) => set({ scale }),
  setError: (error) => set({ error }),
  addPoint: (point) => set((state) => ({ points: [...state.points, point] })),
  addPoint3d: (point) =>
    set((state) => ({ points3d: [...state.points3d, point] })),
  clearPoints: () => set({ points: [], points3d: [], measurement: null }),
  setMeasurement: (measurement) => set({ measurement }),
  setUnit: (unit) => set({ unit }),
}));

// Expose useMeasureStore for Playwright tests
if (typeof window !== 'undefined' && (window as any).isPlaywrightTest) {
  // @ts-expect-error
  window.useMeasureStore = useMeasureStore;
}
