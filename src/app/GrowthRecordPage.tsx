// src/app/GrowthRecordPage.tsx
import React, { useCallback, useRef } from 'react';
import MeasurePage from './MeasurePage';

const GrowthRecordPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 計測キャンバスをPNG保存（prefixのみ変える）
  const handleSave = useCallback((prefix: 'height' | 'hand' | 'foot') => {
    const root = containerRef.current;
    if (!root) {
      window.alert('保存に失敗しました（コンテナ未初期化）');
      return;
    }
    const canvas = root.querySelector('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      window.alert('保存できる画像が見つかりません（キャンバス未検出）');
      return;
    }

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const now = new Date();
      const yyyy = now.getFullYear().toString().padStart(4, '0');
      const mm = (now.getMonth() + 1).toString().padStart(2, '0');
      const dd = now.getDate().toString().padStart(2, '0');
      const HH = now.getHours().toString().padStart(2, '0');
      const MM = now.getMinutes().toString().padStart(2, '0');
      const SS = now.getSeconds().toString().padStart(2, '0');
      const filename = `${prefix}_${yyyy}${mm}${dd}_${HH}${MM}${SS}.png`;

      // 通常のダウンロード
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // 一部ブラウザでdownload無効な場合のフォールバック
      if (!('download' in HTMLAnchorElement.prototype)) {
        window.open(dataUrl, '_blank');
      }
    } catch (e) {
      console.error('save failed', e);
      window.alert('画像の保存に失敗しました。');
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      <MeasurePage />

      {/* 成長記録専用：最下部の保存ボタン群 */}
      <div
        className="absolute left-0 right-0 bottom-0 z-40 pointer-events-auto"
        data-ui-control="true"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <div className="m-3 p-2 rounded-lg bg-black/50 backdrop-blur flex gap-2 justify-center">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 active:opacity-90"
            onClick={() => handleSave('height')}
            title="寸法ラベル入りの画像を保存（prefix: height）"
          >
            身長保存
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 active:opacity-90"
            onClick={() => handleSave('hand')}
            title="寸法ラベル入りの画像を保存（prefix: hand）"
          >
            手保存
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-rose-600 text-white font-medium shadow hover:bg-rose-700 active:opacity-90"
            onClick={() => handleSave('foot')}
            title="寸法ラベル入りの画像を保存（prefix: foot）"
          >
            足保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrowthRecordPage;
