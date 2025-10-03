declare type MeasureMode =
  | 'furniture'
  | 'growth-height'
  | 'growth-foot'
  | 'growth-hand'
  | 'growth-weight';

declare interface ScaleEstimation {
  source:
    | 'none'
    | 'a4'
    | 'credit'
    | 'coin-1'
    | 'coin-5'
    | 'coin-10'
    | 'coin-50'
    | 'coin-100'
    | 'coin-500'
    | 'bill-1000'
    | 'bill-2000'
    | 'bill-5000'
    | 'bill-10000';
  mmPerPx: number; // 推定スケール
  confidence: number; // 0..1
}

declare interface MeasurementResult {
  mode: MeasureMode;
  valueMm?: number; // For all measurements except weight
  valueKg?: number; // For weight only
  unit: 'mm' | 'cm' | 'm' | 'kg';
  dateISO: string; // YYYY-MM-DD
  image?: Blob; // Composite image for growth records only
}

declare interface ErrorState {
  code:
    | 'CAMERA_DENIED'
    | 'XR_UNAVAILABLE'
    | 'PLANE_NOT_FOUND'
    | 'SAVE_FAILED'
    | 'UNKNOWN';
  message: string;
}

declare interface Point3D {
  x: number;
  y: number;
  z: number;
}
