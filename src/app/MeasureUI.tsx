/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';

// 追加：ホモグラフィ計算
import {
  computeHomography,
  rectMmCorners,
  sortCornersClockwise,
  type Vec2,
} from '../core/geometry/homography';

interface MeasureUIProps {
  onStartARSession: () => void;
  onToggleCameraFacingMode: () => void;
  onCapturePhoto: () => void;
  onPickPhoto: () => void;
  isArSupported: boolean;
}

type ReferenceKey =
  | 'credit-card'
  | 'a4-portrait'
  | 'a4-landscape'
  | 'note-1000'
  | 'custom';

// ←★ キーにハイフンがあるので「必ず文字列キー」で書く
const PRESETS: Record<ReferenceKey, { label: string; w: number; h: number } | null> = {
  'credit-card':  { label: 'クレジットカード（85.60×53.98mm）', w: 85.60, h: 53.98 },
  'a4-portrait':  { label: 'A4（縦：210×297mm）',                 w: 210,   h: 297 },
  'a4-landscape': { label: 'A4（横：297×210mm）',                 w: 297,   h: 210 },
  'note-1000':    { label: '千円札（150×76mm）',                   w: 150,   h: 76  },
  'custom':       null,
};

const MeasureUIComponent: React.FC<MeasureUIProps> = ({
  onStartARSession,
  onToggleCameraFacingMode,
  onCapturePhoto,
  onPickPhoto,
  isArSupported,
}) => {
  const {
    points,
    points3d,
    measurement,
    unit,
    isArMode,
    isPlaneDetected,
    arError,
    isWebXrSupported,
    facingMode,
    clearPoints,
    error,
    scale,
    setScaleMmPerPx,

    // 追加：四隅・H
    calibCorners,
    setHomography,
    clearCalibCorners,
    homography,
  } = useMeasureStore();

  const [refKey, setRefKey] = useState<ReferenceKey>('credit-card');
  const [customW, setCustomW] = useState<string>('200'); // mm
  const [customH, setCustomH] = useState<string>('200'); // mm
  const [calibMsg, setCalibMsg] = useState<string | null>(null);

  const currentMmPerPx = (scale as any)?.mmPerPx as number | undefined;

  const pxDistance = useMemo(() => {
    if (points.length !== 2) return null;
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
  }, [points]);

  const getInstructionText = () => {
    if (error) {
      return `エラー: ${error.title} - ${error.message}`;
    }
    if (!isArMode) {
      if (!isWebXrSupported || !isArSupported) {
        return 'この端末/ブラウザはWebXR ARに非対応です。写真計測をご利用ください。';
      }
      return null;
    }
    if (arError) return `エラー: ${arError}`;
    if (!isPlaneDetected) return 'AR: デバイスを動かして周囲の平面を検出してください。';
    if (points3d.length === 0) return 'AR: 平面が検出されました。計測の始点をタップしてください。';
    if (points3d.length === 1) return 'AR: 計測の終点をタップしてください。';
    return null;
  };

  //（現状ここでは mm/px の直接適用UIは使っていないので関数のみ残置）
  const resetLinearCalibration = () => {
    setScaleMmPerPx(null);
    setCalibMsg('mm/px 校正をリセットしました。');
  };

  // --- 四隅→平面補正の適用
  const applyHomographyCalibration = () => {
    setCalibMsg(null);
    if (calibCorners.length !== 4) {
      setCalibMsg('写真上で対象矩形の四隅を 1→2→3→4 の順にタップしてください。');
      return;
    }
    let w: number, h: number;
    const preset = PRESETS[refKey];
    if (refKey === 'custom') {
      w = Number(customW);
      h = Number(customH);
      if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
        setCalibMsg('有効な幅・高さ（mm）を入力してください。');
        return;
      }
    } else if (preset) {
      w = preset.w;
      h = preset.h;
    } else {
      setCalibMsg('有効なプリセットを選択してください。');
      return;
    }

    // 入力四隅を安定順序に
    const srcPx: Vec2[] = sortCornersClockwise(calibCorners as Vec2[]);
    const dstMm: Vec2[] = rectMmCorners(w, h);

    try {
      const H = computeHomography(srcPx, dstMm);
      setHomography(H);
      setCalibMsg(`平面補正を適用しました（${w}×${h} mm）。以降は遠近補正された mm で表示されます。`);
      // 等倍率校正は競合するので併用しない（クリア）
      setScaleMmPerPx(null);
    } catch (e: any) {
      console.error(e);
      setCalibMsg('平面補正に失敗しました。四隅の順序や位置を見直してください。');
    }
  };

  const resetHomographyCalibration = () => {
    setHomography(null);
    clearCalibCorners();
    setCalibMsg('平面補正をリセットしました。再度、四隅をタップしてください。');
  };

  const uiContent = (
    <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-3 rounded pointer-events-auto shadow max-w-[92vw]">
        <h1 className="text-xl font-bold">計測モード</h1>

        <p className="text-orange-600 text-sm mb-2">{getInstructionText()}</p>

        {measurement?.valueMm && (
          <p className="text-lg font-medium">
            {formatMeasurement(measurement.valueMm, unit)}
          </p>
        )}

        {/* 操作用ボタン群 */}
        <div className="flex flex-wrap gap-2 mt-2">
          {!isArMode && !error && (
            <button
              className={`px-3 py-2 rounded text-white ${isWebXrSupported && isArSupported ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isWebXrSupported && isArSupported) onStartARSession();
              }}
              disabled={!isWebXrSupported || !isArSupported}
              title={(!isWebXrSupported || !isArSupported) ? 'この端末ではWebXR ARを利用できません' : 'AR計測を開始'}
            >
              AR計測を開始{(!isWebXrSupported || !isArSupported) ? '（未対応）' : ''}
            </button>
          )}

          {!isArMode && !error && (
            <button
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCameraFacingMode();
              }}
              title="イン/アウトカメラを切り替え"
            >
              カメラ切替（{facingMode === 'user' ? 'イン' : 'アウト'}）
            </button>
          )}

          {!isArMode && !error && (
            <>
              <button
                className="px-3 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onCapturePhoto();
                }}
                title="現在のカメラ映像を写真として取り込み"
              >
                写真を撮る
              </button>

              <button
                className="px-3 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800"
                onClick={(e) => {
                  e.stopPropagation();
                  onPickPhoto();
                }}
                title="端末から写真を選択"
              >
                写真を選ぶ
              </button>
            </>
          )}

          {!error && (
            <button
              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={(e) => {
                e.stopPropagation();
                clearPoints();
              }}
              title="ポイントをクリア"
            >
              リセット
            </button>
          )}
        </div>

        {/* ───────── 平面補正（四隅→mm平面） ───────── */}
        <div className="mt-3 p-3 rounded bg-white/85 border border-gray-300">
          <div className="font-semibold mb-1">遠近補正（四隅→平面 mm）</div>
          <div className="text-sm text-gray-700 mb-2">
            写真上で対象矩形の四隅を <b>1 → 2 → 3 → 4</b> の順にタップしてください。
            その後、実寸サイズを選んで「適用」を押すと、遠近補正された mm で測定できます。
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <select
              className="border rounded px-2 py-1"
              value={refKey}
              onChange={(e) => setRefKey(e.target.value as ReferenceKey)}
              onClick={(e) => e.stopPropagation()}
              title="対象矩形の実寸プリセット"
            >
              {Object.entries(PRESETS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v ? v.label : '任意の矩形（幅・高さを入力）'}
                </option>
              ))}
            </select>

            {refKey === 'custom' && (
              <>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="幅(mm)"
                  value={customW}
                  onChange={(e) => setCustomW(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="border rounded px-2 py-1 w-28"
                />
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="高さ(mm)"
                  value={customH}
                  onChange={(e) => setCustomH(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="border rounded px-2 py-1 w-28"
                />
              </>
            )}

            <button
              className={`px-3 py-2 rounded text-white ${calibCorners.length === 4 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={(e) => { e.stopPropagation(); applyHomographyCalibration(); }}
              disabled={calibCorners.length !== 4}
              title="四隅が4点そろうと適用可能"
            >
              適用（四隅→平面補正）
            </button>

            <button
              className="px-3 py-2 rounded border border-gray-400 hover:bg-gray-100"
              onClick={(e) => { e.stopPropagation(); resetHomographyCalibration(); }}
              title="平面補正を解除し、四隅もクリア"
            >
              平面補正リセット
            </button>

            <div className="text-sm text-gray-700 ml-1">
              四隅: {calibCorners.length}/4
              {homography ? '（適用中）' : ''}
            </div>
          </div>

          {calibMsg && <div className="mt-2 text-amber-700 text-sm">{calibMsg}</div>}
        </div>

        {/* ───────── 等倍率（mm/px）情報表示 ───────── */}
        <div className="mt-3 p-2 rounded bg-white/80 border border-gray-300 text-sm text-gray-700">
          <div>
            {pxDistance != null
              ? <>選択中の区間: {Math.round(pxDistance)} px</>
              : <>写真上で2点タップすると区間が表示されます</>}
          </div>
          <div>
            {(scale as any)?.mmPerPx
              ? <>mm/px 校正: <b>{(scale as any).mmPerPx.toFixed(4)}</b> mm/px</>
              : <>mm/px 校正: なし（px表示 or 平面補正を使用）</>}
          </div>
          <div className="mt-1">
            <button
              className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-100"
              onClick={(e) => { e.stopPropagation(); resetLinearCalibration(); }}
              title="mm/px を解除（平面補正を使う場合は解除推奨）"
            >
              mm/px 校正リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const overlayRoot = document.getElementById('ar-overlay');
  if (!overlayRoot) {
    console.error('DOM element with id "ar-overlay" not found. UI will not be rendered.');
    return null;
  }
  return createPortal(uiContent, overlayRoot);
};

export default MeasureUIComponent;
