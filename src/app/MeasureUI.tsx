/* eslint-disable react/prop-types */
import { createPortal } from 'react-dom';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';

interface MeasureUIProps {
  onStartARSession: () => void;
  onToggleCameraFacingMode: () => void;
  onCapturePhoto: () => void;   // 追加
  onPickPhoto: () => void;      // 追加
  isArSupported: boolean;       // 追加（navigator.xr の有無など）
}

const MeasureUIComponent: React.FC<MeasureUIProps> = ({
  onStartARSession,
  onToggleCameraFacingMode,
  onCapturePhoto,
  onPickPhoto,
  isArSupported,
}) => {
  const {
    points3d,
    measurement,
    unit,
    isArMode,
    isPlaneDetected,
    arError,
    isWebXrSupported,
    facingMode,
    clearPoints,
    error, // グローバルエラー
  } = useMeasureStore();

  console.log('MeasureUIComponent: rendered', {
    error,
    isArMode,
    isWebXrSupported,
    isArSupported,
  });

  const getInstructionText = () => {
    if (error) {
      return `エラー: ${error.title} - ${error.message}`;
    }
    if (!isArMode) {
      if (!isWebXrSupported || !isArSupported) {
        return 'この端末/ブラウザはWebXR ARに非対応です。写真計測をご利用ください。';
      }
      // 非ARモードで特に案内が不要なら null
      return null;
    }
    // ARモード中の案内
    if (arError) return `エラー: ${arError}`;
    if (!isPlaneDetected) return 'AR: デバイスを動かして周囲の平面を検出してください。';
    if (points3d.length === 0) return 'AR: 平面が検出されました。計測の始点をタップしてください。';
    if (points3d.length === 1) return 'AR: 計測の終点をタップしてください。';
    return null;
  };

  const uiContent = (
    <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-3 rounded pointer-events-auto shadow">
        <h1 className="text-xl font-bold">計測モード</h1>

        <p className="text-orange-600 text-sm mb-2">{getInstructionText()}</p>

        {measurement?.valueMm && (
          <p className="text-lg font-medium">
            {formatMeasurement(measurement.valueMm, unit)}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {/* AR開始（対応していて、エラーなしで、今が非ARの時） */}
          {!isArMode && !error && (
            <button
              className={`px-4 py-2 rounded text-white ${isWebXrSupported && isArSupported ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
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

          {/* カメラ切替（非AR or AR非対応時） */}
          {!isArMode && !error && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCameraFacingMode();
              }}
              title="イン/アウトカメラを切り替え"
            >
              カメラ切替（{facingMode === 'user' ? 'イン' : 'アウト'}）
            </button>
          )}

          {/* 写真計測（常に利用可・非AR時に前面に出す想定） */}
          {!isArMode && !error && (
            <>
              <button
                className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onCapturePhoto();
                }}
                title="現在のカメラ映像を写真として取り込み"
              >
                写真を撮る
              </button>

              <button
                className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800"
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

          {/* リセット */}
          {!error && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
