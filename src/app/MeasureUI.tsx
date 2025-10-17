/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useMeasureStore, type Homography } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';
// ★ 追加: ホモグラフィ計算関数（画像4点→実寸矩形4点）
import { computeHomography } from '../core/geometry/homography';

interface MeasureUIProps {
  onStartARSession: () => void;
  onToggleCameraFacingMode: () => void;
  onCapturePhoto: () => void;
  onPickPhoto: () => void;
  isArSupported: boolean;
}

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

    // ★ 追加: 平面補正
    homography,
    setHomography,

    // ★ 追加: クリックモード
    selectionMode,
    setSelectionMode,
  } = useMeasureStore();

  // 等倍率（2点）用
  const [lenKey, setLenKey] = useState<ReferenceKeyLength>('creditCardWidth');
  const [customMm, setCustomMm] = useState<string>('');
  const [calibMsg, setCalibMsg] = useState<string | null>(null);

  // 平面補正（4点）用
  const [rectKey, setRectKey] = useState<ReferenceKeyRect>('creditCard');
  const [customRectW, setCustomRectW] = useState<string>('');
  const [customRectH, setCustomRectH] = useState<string>('');

  const currentMmPerPx = (scale as any)?.mmPerPx as number | undefined;

  const pxDistance = useMemo(() => {
    if (points.length !== 2) return null;
    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.hypot(dx, dy);
  }, [points]);

  const getInstructionText = () => {
    if (error) return `エラー: ${error.title} - ${error.message}`;
    if (!isArMode) {
      if (!isWebXrSupported || !isArSupported) {
        return 'この端末/ブラウザはWebXR ARに非対応です。写真計測をご利用ください。';
      }
      // 写真計測時のガイダンス（必要に応じて）
      if (selectionMode === 'calibrate-plane') {
        return '平面補正: 写真上で「基準矩形の四隅」を時計回りで4点タップしてください。';
      }
      return null;
    }
    if (arError) return `エラー: ${arError}`;
    if (!isPlaneDetected) return 'AR: デバイスを動かして周囲の平面を検出してください。';
    if (points3d.length === 0) return 'AR: 平面が検出されました。計測の始点をタップしてください。';
    if (points3d.length === 1) return 'AR: 計測の終点をタップしてください。';
    return null;
  };

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
          {/* AR開始（対応時） */}
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

          {/* カメラ切替 */}
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

          {/* 写真計測 */}
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

          {/* リセット（ポイント） */}
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

        {/* ===== 等倍率（2点）校正パネル ===== */}
        <div className="mt-3 p-3 rounded bg-white/80 border border-gray-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">基準物で校正（2点）</span>
            <select
              className="border rounded px-2 py-1"
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
                placeholder="基準の長さ(mm)"
                value={customMm}
                onChange={(e) => setCustomMm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="border rounded px-2 py-1 w-36"
              />
            )}

            <button
              className={`px-3 py-2 rounded text-white ${points.length === 2 && selectionMode !== 'calibrate-plane' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={(e) => {
                e.stopPropagation();
                applyLengthCalibration();
              }}
              disabled={!(points.length === 2 && selectionMode !== 'calibrate-plane')}
              title="写真上で基準物の両端を2点タップしてから適用"
            >
              適用（2点）
            </button>

            <button
              className="px-3 py-2 rounded border border-gray-400 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                resetLengthCalibration();
              }}
              title="等倍率校正を解除"
            >
              校正リセット
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <div>現在の点数: {points.length}</div>
            <div>
              {pxDistance != null
                ? <>選択中の区間: {Math.round(pxDistance)} px</>
                : <>2点をタップして区間を作成してください</>}
            </div>
            <div>
              {currentMmPerPx
                ? <>校正値: <b>{currentMmPerPx.toFixed(4)}</b> mm/px（2点距離はmm表示）</>
                : <>未校正（2点法）: px表示</>}
            </div>
          </div>
        </div>

        {/* ===== 平面補正（4点）パネル ===== */}
        <div className="mt-3 p-3 rounded bg-white/80 border border-gray-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">平面補正（4点・時計回り）</span>

            {selectionMode !== 'calibrate-plane' ? (
              <button
                className="px-3 py-2 rounded text-white bg-teal-600 hover:bg-teal-700"
                onClick={(e) => { e.stopPropagation(); startPlaneCalibration(); }}
                title="平面補正モードに入り、四隅を4点タップします"
              >
                四角 → 平面補正モード開始
              </button>
            ) : (
              <button
                className="px-3 py-2 rounded bg-gray-100 border hover:bg-gray-200"
                onClick={(e) => { e.stopPropagation(); cancelPlaneCalibration(); }}
                title="平面補正モードを終了（点はクリアされます）"
              >
                平面補正モード終了
              </button>
            )}

            <select
              className="border rounded px-2 py-1"
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
                  className="border rounded px-2 py-1 w-28"
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
                  className="border rounded px-2 py-1 w-28"
                />
              </>
            )}

            <button
              className={`px-3 py-2 rounded text-white ${
                selectionMode === 'calibrate-plane' && points.length === 4
                  ? 'bg-teal-700 hover:bg-teal-800'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              onClick={(e) => { e.stopPropagation(); applyPlaneCalibration(); }}
              disabled={!(selectionMode === 'calibrate-plane' && points.length === 4)}
              title="四隅を4点タップ後に適用"
            >
              適用（平面補正）
            </button>

            {homography && (
              <span className="text-xs text-teal-700 ml-2">平面補正: ON</span>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <div>現在の点数: {points.length}（平面補正モード中は最大4点）</div>
            <div className="text-gray-600">
              点は時計回りで: 左上 → 右上 → 右下 → 左下 の順に選ぶと安定します。
            </div>
            {calibMsg && <div className="mt-1 text-amber-700">{calibMsg}</div>}
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
