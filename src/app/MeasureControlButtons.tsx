import React from 'react';
import { useMeasureStore } from '../store/measureStore';

type Fn = () => void;

interface MeasureControlButtonsProps {
  onStartARSession?: Fn;
  onToggleCameraFacingMode?: Fn;
  onCapturePhoto?: Fn;
  onPickPhoto?: Fn;
  isArSupported?: boolean;
}

const noop = () => {};

const MeasureControlButtons: React.FC<MeasureControlButtonsProps> = ({
  onStartARSession = noop,
  onToggleCameraFacingMode = noop,
  onCapturePhoto = noop,
  onPickPhoto = noop,
  isArSupported = false,
}) => {
  const {
    isArMode,
    error,
    isWebXrSupported,
    // facingMode, // 未使用のためコメントアウト
    clearPoints,
  } = useMeasureStore();

  const canUseAr = isWebXrSupported && isArSupported;

  return (
    <div
      className="px-4 py-2 pointer-events-auto flex justify-center z-30"
      data-ui-control="true"
      // 親（MeasurePage）のonClickへバブリングさせない保険
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-black/50 backdrop-blur p-2 rounded-lg shadow-lg flex flex-wrap gap-2">
        {/* AR開始（対応時） */}
        {!isArMode && !error && (
          <button
            className={`px-3 py-2 rounded text-white ${
              canUseAr ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (canUseAr) onStartARSession();
            }}
            disabled={!canUseAr}
            title={canUseAr ? 'AR計測を開始' : 'この端末ではWebXR ARを利用できません'}
          >
            AR計測を開始
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
            カメラ切替
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
    </div>
  );
};

export default MeasureControlButtons;
