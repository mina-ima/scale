interface ImportMetaEnv {
  readonly VITE_APP_DEBUG: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  isPlaywrightTest: boolean;
  setScale: (
    scale: import('../core/reference/ScaleEstimation').ScaleEstimation | null
  ) => void;
  useMeasureStore: typeof import('../store/measureStore').useMeasureStore;
  xrFrameRef: React.MutableRefObject<XRFrame | null>;
  mockGetTapCoordinates: (event: MouseEvent) => { x: number; y: number };
  mockCalculate2dDistance: (
    p1: import('../core/fallback/utils').Point,
    p2: import('../core/fallback/utils').Point,
    mmPerPx: number
  ) => number;
  mockMeasureStoreScale: import('../core/reference/ScaleEstimation').ScaleEstimation;
}
