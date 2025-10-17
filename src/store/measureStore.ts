import { create } from 'zustand';
import { Point } from '../core/fallback/utils';
import { ScaleEstimation } from '../core/reference/ScaleEstimation';
import type { Homography } from '../core/geometry/homography';

// 3D点
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface MeasurementResult {
  mode: MeasureMode;
  measurementMethod: 'ar' | 'fallback';
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

  /** 画像上の 1px あたりの mm（一次校正：等倍率） */
  scale: ScaleEstimation | null;

  /** 平面校正：四隅（画像px座標、最大4点） */
  calibCorners: Point[];

  /** 平面校正：画像px → 平面mm のホモグラフィ（遠近補正） */
  homography: Homography | null;

  error: ErrorState | null;

  /** 2D計測点（写真/カメラ上） */
  points: Point[];
  /** 3D計測点（AR） */
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

  /** ScaleEstimation そのものを設定（既存互換） */
  setScale: (scale: ScaleEstimation | null) => void;

  /** mmPerPx を直接設定（nullならリセット） */
  setScaleMmPerPx: (mmPerPx: number | null) => void;

  /** 四隅の追加（最大4点）。5点目以降はリセットして新規開始。 */
  addCalibCorner: (p: Point) => void;
  /** 四隅のクリア */
  clearCalibCorners: () => void;

  /** ホモグラフィの設定/解除 */
  setHomography: (H: Homography | null) => void;

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

  calibCorners: [],
  homography: null,

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

  // 既存互換のスケール設定
  setScale: (scale) => set({ scale }),

  // mmPerPx を直接設定（手動校正で使用）
  setScaleMmPerPx: (mmPerPx) =>
    set(() => {
      if (mmPerPx == null || Number.isNaN(mmPerPx) || !Number.isFinite(mmPerPx)) {
        return { scale: null };
      }
      const scaleObj = { mmPerPx } as ScaleEstimation;
      return { scale: scaleObj };
    }),

  // 四隅の管理（最大4。5つ目が来たらやり直し）
  addCalibCorner: (p) =>
    set((state) => {
      if (state.calibCorners.length >= 4) {
        return { calibCorners: [p] };
      }
      return { calibCorners: [...state.calibCorners, p] };
    }),
  clearCalibCorners: () => set({ calibCorners: [] }),

  setHomography: (H) => set({ homography: H }),

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

  setCameraToggleRequested: (requested) => set({ cameraToggleRequested: requested }),
}));

// Playwright テスト用に公開
if (typeof window !== 'undefined' && (window as any).isPlaywrightTest) {
  (window as any).useMeasureStore = useMeasureStore;
}
