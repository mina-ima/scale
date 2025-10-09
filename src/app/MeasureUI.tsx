import { createPortal } from 'react-dom';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';

const MeasureUI: React.FC = () => {
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
    setIsArMode,
    setCameraToggleRequested,
  } = useMeasureStore();

  const getInstructionText = () => {
    if (!isArMode) return null;
    if (arError) return `エラー: ${arError}`;
    if (!isPlaneDetected) return "AR: デバイスを動かして周囲の平面を検出してください。";
    if (points3d.length === 0) return "AR: 平面が検出されました。計測の始点をタップしてください。";
    if (points3d.length === 1) return "AR: 計測の終点をタップしてください。";
    return null;
  };

  const uiContent = (
    <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
      <div className="absolute top-4 left-4 bg-white bg-opacity-75 p-2 rounded pointer-events-auto">
        <h1 className="text-xl font-bold">計測モード</h1>
        <p className="text-orange-500 text-sm mb-2">{getInstructionText()}</p>
        {measurement?.valueMm && (
          <p className="text-lg">{formatMeasurement(measurement.valueMm, unit)}</p>
        )}
        {isWebXrSupported && !isArMode && (
          <button
            className="mt-2 ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={(e) => { e.stopPropagation(); setIsArMode(true); }}
          >
            AR計測を開始
          </button>
        )}
        {!isArMode && (
            <button
                className="mt-2 ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={(e) => { e.stopPropagation(); setCameraToggleRequested(true); }}
            >
                カメラ切り替え ({facingMode === 'user' ? 'インカメラ' : 'アウトカメラ'})
            </button>
        )}
        <button
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={(e) => { e.stopPropagation(); clearPoints(); }}
        >
          リセット
        </button>
      </div>
    </div>
  );

  const overlayRoot = document.getElementById('ar-overlay');
  return overlayRoot ? createPortal(uiContent, overlayRoot) : null;
};

export default MeasureUI;
