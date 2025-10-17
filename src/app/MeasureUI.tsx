/* eslint-disable react/prop-types */
import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';

interface MeasureUIProps {
  onStartARSession: () => void;
  onToggleCameraFacingMode: () => void;
  onCapturePhoto: () => void;
  onPickPhoto: () => void;
  isArSupported: boolean;
}

type ReferenceKey =
  | 'credit-card-width'
  | 'a4-width'
  | 'a4-height'
  | 'coin-100'
  | 'coin-500'
  | 'note-1000-width'
  | 'custom';

const REFERENCES: { key: ReferenceKey; label: string; mm: number | null }[] = [
  { key: 'credit-card-width', label: 'クレジットカードの横幅（85.60mm）', mm: 85.6 },
  { key: 'a4-width',           label: 'A4 短辺（210mm）',                  mm: 210 },
  { key: 'a4-height',          label: 'A4 長辺（297mm）',                  mm: 297 },
  { key: 'coin-100',           label: '100円硬貨 直径（22.6mm）',           mm: 22.6 },
  { key: 'coin-500',           label: '500円硬貨 直径（26.5mm）',           mm: 26.5 },
  { key: 'note-1000-width',    label: '千円札の横幅（150mm）',              mm: 150 },
  { key: 'custom',             label: '任意の長さ（mmを入力）',             mm: null },
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
  } = useMeasureStore();

  const [refKey, setRefKey] = useState<ReferenceKey>('credit-card-width');
  const [customMm, setCustomMm] = useState<string>('');
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

  const applyCalibration = () => {
    setCalibMsg(null);
    if (pxDistance == null || pxDistance <= 0) {
      setCalibMsg('写真上で基準物の両端を2点タップしてください。');
      return;
    }
    const preset = REFERENCES.find(r => r.key === refKey);
    const mm =
      preset?.mm != null
        ? preset.mm
        : Number.isFinite(Number(customMm)) ? Number(customMm) : NaN;

    if (!Number.isFinite(mm) || (mm as number) <= 0) {
      setCalibMsg('有効な基準長（mm）を入力してください。');
      return;
    }

    const mmPerPx = (mm as number) / pxDistance;
    if (!Number.isFinite(mmPerPx) || mmPerPx <= 0) {
      setCalibMsg('校正に失敗しました。別の基準や写真でお試しください。');
      return;
    }

    setScaleMmPerPx(mmPerPx);
    setCalibMsg(`校正を適用しました（mm/px = ${mmPerPx.toFixed(4)}）。以降の測定はmm表示になります。`);
  };

  const resetCalibration = () => {
    setScaleMmPerPx(null);
    setCalibMsg('校正をリセットしました。再度、基準物の2点をタップして適用してください。');
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

        {/* 校正パネル */}
        <div className="mt-3 p-3 rounded bg-white/80 border border-gray-300">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">基準物で校正</span>
            <select
              className="border rounded px-2 py-1"
              value={refKey}
              onChange={(e) => setRefKey(e.target.value as ReferenceKey)}
              onClick={(e) => e.stopPropagation()}
              title="写真に写っている基準物を選択"
            >
              {REFERENCES.map((r) => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>

            {refKey === 'custom' && (
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
              className={`px-3 py-2 rounded text-white ${points.length === 2 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={(e) => {
                e.stopPropagation();
                applyCalibration();
              }}
              disabled={points.length !== 2}
              title="写真上で基準物の両端を2点タップしてから適用"
            >
              適用
            </button>

            <button
              className="px-3 py-2 rounded border border-gray-400 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                resetCalibration();
              }}
              title="校正を解除"
            >
              校正リセット
            </button>
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <div>現在の点数: {points.length}（基準は2点で適用）</div>
            <div>
              {pxDistance != null
                ? <>選択中の基準区間: {Math.round(pxDistance)} px</>
                : <>基準物の両端を写真上で2点タップしてください</>}
            </div>
            <div>
              {currentMmPerPx
                ? <>校正値: <b>{currentMmPerPx.toFixed(4)}</b> mm/px（以降の測定はmm表示）</>
                : <>未校正: px表示。基準を選んで適用してください。</>}
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
