import { create } from 'zustand';
import { Point } from '../core/fallback/utils';
import { ScaleEstimation } from '../core/reference/ScaleEstimation';

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

// ★ 追加: ホモグラフィ（3x3）
export type Homography = [number, number, number, number, number, number, number, number, number];

// ★ 追加: クリック挙動を切り替えるモード
export type SelectionMode = 'measure' | 'calibrate-two' | 'calibrate-plane';


// ★ 追加: 補正方法の選択モード
export type CalibrationMode = 'length' | 'plane';

export interface MeasureState {
  measureMode: MeasureMode;
  /** 画像上の 1px あたりの mm（校正結果）。null なら未校正 */
  scale: ScaleEstimation | null;
  /** 平面補正ホモグラフィ（画像px → 平面mm） */
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

  /** クリック動作モード（2点測定 / 4点平面校正 など） */
  selectionMode: SelectionMode;

  /** OpenCV.jsの初期化が完了したか */
  isCvReady: boolean;
  /** 補正方法の選択モード */
  calibrationMode: CalibrationMode;

  /** OpenCV.jsの初期化状態を設定 */
  setIsCvReady: (isReady: boolean) => void;
  setMeasureMode: (mode: MeasureMode) => void;

  /** ScaleEstimation そのものを設定（既存互換） */
  setScale: (scale: ScaleEstimation | null) => void;
  /** mmPerPx を直接設定（nullならリセット） */
  setScaleMmPerPx: (mmPerPx: number | null) => void;

  /** ★ 追加: ホモグラフィ設定/解除 */
  setHomography: (H: Homography | null) => void;

  /** ★ 追加: クリック動作モード切替 */
  setSelectionMode: (mode: SelectionMode) => void;

  /** ★ 追加: 補正方法の選択モード切替 */
  setCalibrationMode: (mode: CalibrationMode) => void;

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
  getCanvasBlobFunction: (() => Promise<Blob | null>) | null;
  setGetCanvasBlobFunction: (func: (() => Promise<Blob | null>) | null) => void;
}

export const useMeasureStore = create<MeasureState>((set) => ({
  measureMode: 'furniture',
  scale: null,
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

  isCvReady: false,
  selectionMode: 'measure',
  calibrationMode: 'length', // 初期値は2点補正

  getCanvasBlobFunction: null,

  setIsCvReady: (isReady) => set({ isCvReady: isReady }),
  setMeasureMode: (mode) => set({ measureMode: mode }),

  // 既存互換のスケール設定
  setScale: (scale) => set({ scale }),

  // mmPerPx を直接設定（手動校正で使用）
  setScaleMmPerPx: (mmPerPx) =>
    set(() => {
      if (mmPerPx == null || Number.isNaN(mmPerPx) || !Number.isFinite(mmPerPx)) {
        return { scale: null }; // リセット
      }
      const scaleObj = { mmPerPx } as ScaleEstimation;
      return { scale: scaleObj };
    }),

  // ★ 追加: ホモグラフィ設定/解除
  setHomography: (H) => set({ homography: H }),

  // ★ 追加: クリック動作モード
  setSelectionMode: (mode) => set({ selectionMode: mode }),

  // ★ 追加: 補正方法の選択モード切替
  setCalibrationMode: (mode) => set({ calibrationMode: mode }),

  setError: (error) => set({ error }),

  // ★ 重要: モードに応じて 2点 or 4点 を保持
  addPoint: (point) =>
    set((state) => {
      if (state.selectionMode === 'calibrate-plane') {
        // 平面校正中は最大 4 点まで保持（5点目以降は最新4点にする）
        const next = [...state.points, point];
        const clipped = next.length > 4 ? next.slice(next.length - 4) : next;
        return { points: clipped };
      }
      // それ以外（通常測定/等倍率校正）は最大 2 点
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

  setGetCanvasBlobFunction: (func) => set({ getCanvasBlobFunction: func }),
}));

// Playwright テスト用に公開
if (typeof window !== 'undefined' && (window as any).isPlaywrightTest) {
  (window as any).useMeasureStore = useMeasureStore;
}
