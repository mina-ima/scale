import { create } from 'zustand';
import { Point } from '../core/fallback/utils';

interface MeasureState {
  measureMode: MeasureMode;
  scale: ScaleEstimation | null;
  error: ErrorState | null;
  points: Point[];
  measurement: MeasurementResult | null;
  setMeasureMode: (mode: MeasureMode) => void;
  setScale: (scale: ScaleEstimation | null) => void;
  setError: (error: ErrorState | null) => void;
  addPoint: (point: Point) => void;
  clearPoints: () => void;
  setMeasurement: (measurement: MeasurementResult | null) => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  measureMode: 'furniture', // Default mode
  scale: null,
  error: null,
  points: [],
  measurement: null,
  setMeasureMode: (mode) => set({ measureMode: mode }),
  setScale: (scale) => set({ scale }),
  setError: (error) => set({ error }),
  addPoint: (point) => set((state) => ({ points: [...state.points, point] })),
  clearPoints: () => set({ points: [], measurement: null }),
  setMeasurement: (measurement) => set({ measurement }),
}));
