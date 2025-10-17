import { create } from 'zustand';
import { Point } from '../core/fallback/utils';
import { ScaleEstimation } from '../core/reference/ScaleEstimation'; // Import the correct ScaleEstimation

// We need to define Point3D and other types used in the state
// For now, let's use a basic interface.
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface MeasurementResult {
  mode: MeasureMode; // Use MeasureMode for the measurement type
  measurementMethod: 'ar' | 'fallback'; // New property to indicate AR or fallback
  valueMm?: number;
  unit: 'cm' | 'm';
  dateISO: string;
}

export type MeasureMode =
  | 'furniture'
  | 'growth-height'
  | 'growth-foot'
  | 'growth-hand'
  | 'growth-weight';
export type ErrorState = {
  title: string;
  message: string;
  code?:
    | 'CAMERA_DENIED'
    | 'CAMERA_UNAVAILABLE'
    | 'XR_UNAVAILABLE'
    | 'PLANE_NOT_FOUND'
    | 'SAVE_FAILED'
    | 'UNKNOWN';
  name: string;
} | null;

export interface MeasureState {
  measureMode: MeasureMode;
  scale: ScaleEstimation | null;
  error: ErrorState | null;
  points: Point[];
  points3d: Point3D[];
  measurement: MeasurementResult | null;
  unit: 'cm' | 'm';
  isArMode: boolean;
  xrSession: XRSession | null;
  isPlaneDetected: boolean;
  arError: string | null;
  isWebXrSupported: boolean;
  cameraToggleRequested: boolean;
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
  setXrSession: (session: XRSession | null) => void;
  setIsPlaneDetected: (isPlaneDetected: boolean) => void;
  setArError: (error: string | null) => void;
  setIsWebXrSupported: (supported: boolean) => void;
  setCameraToggleRequested: (requested: boolean) => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  measureMode: 'furniture',
  scale: null,
  error: null,
  points: [],
  points3d: [],
  measurement: null,
  unit: 'cm',
  isArMode: false,
  xrSession: null,
  isPlaneDetected: false,
  arError: null,
  isWebXrSupported: false,
  cameraToggleRequested: false,
  facingMode: 'environment',

  setMeasureMode: (mode) => set({ measureMode: mode }),
  setScale: (scale) => set({ scale }),
  setError: (error) => set({ error }),
  addPoint: (point) =>
    set((state) => {
      if (state.points.length >= 2) {
        return { points: [point], points3d: [], measurement: null };
      }
      return { points: [...state.points, point] };
    }),
  addPoint3d: (point) =>
    set((state) => {
      if (state.points3d.length >= 2) {
        return { points3d: [point], points: [], measurement: null };
      }
      return { points3d: [...state.points3d, point] };
    }),
  clearPoints: () => set({ points: [], points3d: [], measurement: null }),
  setMeasurement: (measurement) => set({ measurement }),
  setUnit: (unit) => set({ unit }),
  setIsArMode: (isArMode) => set({ isArMode }),
  setXrSession: (session) => set({ xrSession: session }),
  setIsPlaneDetected: (isPlaneDetected) => set({ isPlaneDetected }),
  setArError: (error) => set({ arError: error }),
  setIsWebXrSupported: (supported) => set({ isWebXrSupported: supported }),
  setCameraToggleRequested: (requested) =>
    set({ cameraToggleRequested: requested }),
}));

// Expose useMeasureStore for Playwright tests
if (typeof window !== 'undefined' && window.isPlaywrightTest) {
  window.useMeasureStore = useMeasureStore;
}
