import React, { useState, useMemo } from 'react';
import { useMeasureStore, type Homography } from '../store/measureStore';
import { computeHomography } from '../core/geometry/homography';

type ReferenceKeyRect =
  | 'creditCard'      // 85.60 x 53.98
  | 'a4Portrait'      // 210 x 297
  | 'a4Landscape'     // 297 x 210
  | 'yen1000'         // 150 x 76
  | 'yen10000'        // 160 x 76
  | 'customRect';

const RECT_PRESETS: Record<ReferenceKeyRect, { label: string; w: number; h: number } | null> = {
  creditCard:  { label: 'カード（85.60×53.98mm）', w: 85.60, h: 53.98 },
  a4Portrait:  { label: 'A4 縦（210×297mm）',      w: 210,   h: 297   },
  a4Landscape: { label: 'A4 横（297×210mm）',      w: 297,   h: 210   },
  yen1000:     { label: '千円札（150×76mm）',       w: 150,   h: 76    },
  yen10000:    { label: '一万円札（160×76mm）',     w: 160,   h: 76    },
  customRect:  null,
};

type ReferenceKeyLength =
  | 'creditCardWidth'  // 85.60
  | 'a4Short'          // 210
  | 'a4Long'           // 297
  | 'coin100'          // 22.6
  | 'coin500'          // 26.5
  | 'yen1000Width'     // 150
  | 'yen10000Width'    // 160
  | 'customLength';

const LENGTH_PRESETS: { key: ReferenceKeyLength; label: string; mm: number | null }[] = [
  { key: 'creditCardWidth', label: 'カード横幅（85.60mm）', mm: 85.6 },
  { key: 'a4Short',         label: 'A4 短辺（210mm）',     mm: 210 },
  { key: 'a4Long',          label: 'A4 長辺（297mm）',     mm: 297 },
  { key: 'coin100',         label: '100円硬貨 直径（22.6mm）', mm: 22.6 },
  { key: 'coin500',         label: '500円硬貨 直径（26.5mm）', mm: 26.5 },
  { key: 'yen1000Width',    label: '千円札の横幅（150mm）', mm: 150 },
  { key: 'yen10000Width',   label: '一万円札の横幅（160mm）', mm: 160 },
  { key: 'customLength',    label: '任意の長さ（mmを入力）', mm: null },
];

interface MeasureCalibrationPanelProps {
  // useMeasureStoreから取得するstate
  points: { x: number; y: number }[];
  selectionMode: 'measure' | 'calibrate-plane';
  calibrationMode: 'length' | 'plane';
  homography: Homography | null;
  // useMeasureStoreから取得するaction
  setSelectionMode: (mode: 'measure' | 'calibrate-plane') => void;
  setCalibrationMode: (mode: 'length' | 'plane') => void;
  setHomography: (H: Homography | null) => void;
  setScaleMmPerPx: (mmPerPx: number | null) => void;
  clearPoints: () => void;
}

const MeasureCalibrationPanel: React.FC<MeasureCalibrationPanelProps> = ({
  points,
  selectionMode,
  calibrationMode,
  homography,
  setSelectionMode,
  setCalibrationMode,
  setHomography,
  setScaleMmPerPx,
  clearPoints,
}) => {
  // 等倍率（2点）用
  const [lenKey, setLenKey] = useState<ReferenceKeyLength>('creditCardWidth');
  const [customMm, setCustomMm] = useState<string>('');
  const [calibMsg, setCalibMsg] = useState<string | null>(null);

  // 平面補正（4点）用
  const [rectKey, setRectKey] = useState<ReferenceKeyRect>('creditCard');
  const [customRectW, setCustomRectW] = useState<string>('');
  const [customRectH, setCustomRectH] = useState<string>('');

  const { scale } = useMeasureStore(); // scaleはuseMeasureStoreから直接取得
  const currentMmPerPx = (scale as any)?.mmPerPx as number | undefined;

  const pxDistance = useMemo(() => {
    if (points.length !== 2) return null;
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
  }, [points]);

  // ====== 等倍率（2点）校正 ======
  const applyLengthCalibration = () => {
    setCalibMsg(null);
    if (pxDistance == null || pxDistance <= 0) {
      setCalibMsg('写真上で基準物の両端を2点タップしてください。');
      return;
    }
    const preset = LENGTH_PRESETS.find(r => r.key === lenKey);
    const mm =
      preset?.mm != null ? preset.mm : Number.isFinite(Number(customMm)) ? Number(customMm) : NaN;
    if (!Number.isFinite(mm) || (mm as number) <= 0) {
      setCalibMsg('有効な基準長（mm）を入力してください。');
      return;
    }
    const mmPerPx = (mm as number) / pxDistance;
    if (!Number.isFinite(mmPerPx) || mmPerPx <= 0) {
      setCalibMsg('校正に失敗しました。別の基準や写真でお試しください。');
      return;
    }
    // 等倍率校正を適用するときは平面補正はクリア
    setHomography(null);
    setScaleMmPerPx(mmPerPx);
    setCalibMsg(`校正を適用（mm/px = ${mmPerPx.toFixed(4)}）。以降の測定はmm表示になります。`);
  };

  const resetLengthCalibration = () => {
    setScaleMmPerPx(null);
    setCalibMsg('校正（mm/px）をリセットしました。');
  };

  // ====== 平面補正（4点） ======
  const startPlaneCalibration = () => {
    setCalibMsg(null);
    // クリックモードを「四隅キャプチャ」に
    setSelectionMode('calibrate-plane');
    // 既存の2点/計測はクリアしておくと迷わない
    clearPoints();
  };

  const cancelPlaneCalibration = () => {
    setSelectionMode('measure');
    clearPoints();
  };

  const applyPlaneCalibration = () => {
    setCalibMsg(null);
    if (points.length !== 4) {
      setCalibMsg('写真上で四隅を「時計回り」で4点タップしてください。');
      return;
    }
    const preset = RECT_PRESETS[rectKey];
    const w = preset ? preset.w : Number(customRectW);
    const h = preset ? preset.h : Number(customRectH);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      setCalibMsg('有効な矩形サイズ（mm）を入力してください。');
      return;
    }

    // 画像座標（px）: p0..p3（時計回り）
    const imgPts = points.map(p => ({ x: p.x, y: p.y }));

    // 実平面上の矩形（mm）を (0,0)->(w,0)->(w,h)->(0,h) に固定
    const worldPts = [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ];

    try {
      const H = computeHomography(imgPts, worldPts) as Homography;
      if (!H || H.length !== 9) {
        setCalibMsg('ホモグラフィ計算に失敗しました。点の順序/位置を見直してください。');
        return;
      }
      // 平面補正を有効化し、等倍率校正はクリア
      setHomography(H);
      setScaleMmPerPx(null);
      setSelectionMode('measure');
      clearPoints();
      setCalibMsg('平面補正を適用しました。以降の2点計測は平面mmで算出されます。');
    } catch (e) {
      console.error('computeHomography failed', e);
      setCalibMsg('平面補正に失敗しました。四隅順序（時計回り）と矩形サイズを確認してください。');
    }
  };

  return (
    <div className="p-4 pointer-events-auto z-30"> {/* z-indexを高く設定 */}
      <div className="bg-black/50 backdrop-blur p-4 rounded-lg shadow-lg">
        {/* ===== 校正方法選択タブ ===== */}
        <div className="flex border-b border-gray-300">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              calibrationMode === 'length'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCalibrationMode('length');
            }}
          >
            2点補正
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              calibrationMode === 'plane'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setCalibrationMode('plane');
            }}
          >
            4点補正
          </button>
        </div>

        {/* ===== 等倍率（2点）校正パネル ===== */}
        {calibrationMode === 'length' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">基準物（2点）</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={lenKey}
                onChange={(e) => setLenKey(e.target.value as ReferenceKeyLength)}
                onClick={(e) => e.stopPropagation()}
                title="写真に写っている基準物を選択"
              >
                {LENGTH_PRESETS.map((r) => (
                  <option key={r.key} value={r.key}>{r.label}</option>
                ))}
              </select>

              {lenKey === 'customLength' && (
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="長さ(mm)"
                  value={customMm}
                  onChange={(e) => setCustomMm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="border rounded px-2 py-1 w-28 text-sm"
                />
              )}

              <button
                className={`px-3 py-1.5 rounded text-white text-sm ${points.length === 2 && selectionMode !== 'calibrate-plane' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  applyLengthCalibration();
                }}
                disabled={!(points.length === 2 && selectionMode !== 'calibrate-plane')}
                title="写真上で基準物の両端を2点タップしてから適用"
              >
                適用
              </button>

              <button
                className="px-3 py-1.5 rounded border border-gray-400 hover:bg-gray-100 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  resetLengthCalibration();
                }}
                title="等倍率校正を解除"
              >
                リセット
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-700">
              <div>現在の点数: {points.length}</div>
              <div>
                {pxDistance != null
                  ? <>選択中の区間: {Math.round(pxDistance)} px</>
                  : <>2点をタップして区間を作成</>}
              </div>
              <div>
                {currentMmPerPx
                  ? <>校正値: <b>{currentMmPerPx.toFixed(4)}</b> mm/px</>
                  : <>未校正</>}
              </div>
            </div>
          </div>
        )}

        {/* ===== 平面補正（4点）パネル ===== */}
        {calibrationMode === 'plane' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm">平面補正（4点）</span>

              {selectionMode !== 'calibrate-plane' ? (
                <button
                  className="px-3 py-1.5 rounded text-white bg-teal-600 hover:bg-teal-700 text-sm"
                  onClick={(e) => { e.stopPropagation(); startPlaneCalibration(); }}
                  title="平面補正モードに入り、四隅を4点タップします"
                >
                  開始
                </button>
              ) : (
                <button
                  className="px-3 py-1.5 rounded bg-gray-100 border hover:bg-gray-200 text-sm"
                  onClick={(e) => { e.stopPropagation(); cancelPlaneCalibration(); }}
                  title="平面補正モードを終了（点はクリアされます）"
                >
                  終了
                </button>
              )}

              <select
                className="border rounded px-2 py-1 text-sm"
                value={rectKey}
                onChange={(e) => setRectKey(e.target.value as ReferenceKeyRect)}
                onClick={(e) => e.stopPropagation()}
                title="写真に写っている矩形基準を選択"
              >
                {Object.entries(RECT_PRESETS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v ? v.label : '任意の矩形（mm指定）'}
                  </option>
                ))}
              </select>

              {rectKey === 'customRect' && (
                <>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder="幅(mm)"
                    value={customRectW}
                    onChange={(e) => setCustomRectW(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="border rounded px-2 py-1 w-24 text-sm"
                  />
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder="高さ(mm)"
                    value={customRectH}
                    onChange={(e) => setCustomRectH(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="border rounded px-2 py-1 w-24 text-sm"
                  />
                </>
              )}

              <button
                className={`px-3 py-1.5 rounded text-white text-sm ${
                  selectionMode === 'calibrate-plane' && points.length === 4
                    ? 'bg-teal-700 hover:bg-teal-800'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  applyPlaneCalibration();
                }}
                disabled={!(selectionMode === 'calibrate-plane' && points.length === 4)}
                title="四隅を4点タップ後に適用"
              >
                適用
              </button>

              {homography && (
                <span className="text-xs text-teal-700 ml-2">ON</span>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-700">
              <div>現在の点数: {points.length}（最大4点）</div>
              <div className="text-gray-600">
                基準の四隅を時計回りでタップ
              </div>
              {calibMsg && <div className="mt-1 text-amber-700">{calibMsg}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return uiContent;
};

export default MeasureCalibrationPanel;
