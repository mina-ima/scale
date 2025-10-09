import { create } from 'zustand';
import { Point } from '../core/fallback/utils';

// We need to define Point3D and other types used in the state
// For now, let's use a basic interface.
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface MeasurementResult {
    mode: 'ar' | 'fallback';
    valueMm: number;
    unit: 'cm' | 'm';
    dateISO: string;
}

export type MeasureMode = 'furniture' | 'growth';
export type ErrorState = {
    title: string;
    message: string;
} | null;

// This is a placeholder for the real ScaleEstimation type
export interface ScaleEstimation {
    scale: number;
    referenceType: string;
}


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
  facingMode: 'user' | 'environment';
  cameraToggleRequested: boolean;

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
  setFacingMode: (mode: 'user' | 'environment') => void;
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
  facingMode: 'environment',
  cameraToggleRequested: false,

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
  setXrSession: (session) => set({ xrSession: session }),
  setIsPlaneDetected: (isPlaneDetected) => set({ isPlaneDetected }),
  setArError: (error) => set({ arError: error }),
  setIsWebXrSupported: (supported) => set({ isWebXrSupported: supported }),
  setFacingMode: (mode) => set({ facingMode: mode }),
  setCameraToggleRequested: (requested) => set({ cameraToggleRequested: requested }),
}));

// Expose useMeasureStore for Playwright tests
if (typeof window !== 'undefined' && window.isPlaywrightTest) {
  window.useMeasureStore = useMeasureStore;
}
