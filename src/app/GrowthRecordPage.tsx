// src/app/GrowthRecordPage.tsx
import React, { useCallback, useRef } from 'react';
import MeasurePage from './MeasurePage';

const GrowthRecordPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // コンテナ内から保存対象の canvas を選ぶ
  const pickCanvas = (root: HTMLElement): HTMLCanvasElement | null => {
    const canvases = Array.from(root.querySelectorAll('canvas')) as HTMLCanvasElement[];
    if (canvases.length === 0) return null;
    // 面積が最大のものを優先（背景＋描画を担うキャンバス想定）
    const byArea = [...canvases].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    return byArea[0] ?? canvases[0];
  };

  // 画像保存（prefix: 'height' | 'hand' | 'foot'）
  const handleSave = useCallback((prefix: 'height' | 'hand' | 'foot') => {
    const root = containerRef.current;
    if (!root) {
      window.alert('保存に失敗しました（コンテナ未初期化）');
      return;
    }
    const canvas = pickCanvas(root);
    if (!canvas) {
      window.alert('保存できる画像が見つかりません（キャンバス未検出）');
      return;
    }

    // ファイル名（英数字＋日時）
    const now = new Date();
    const yyyy = String(now.getFullYear()).padStart(4, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const MM = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');
    const filename = `${prefix}_${yyyy}${mm}${dd}_${HH}${MM}${SS}.png`;

    // toBlob の方がモバイルで安定
    canvas.toBlob((blob) => {
      if (!blob) {
        // まれに toBlob 未対応の環境 → dataURL フォールバック
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = dataUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          // さらにタブオープンも併用（ダウンロード不可時の表示用）
          window.open(dataUrl, '_blank');
        } catch (e) {
          console.error(e);
          window.alert('画像の保存に失敗しました。');
        }
        return;
      }

      const url = URL.createObjectURL(blob);
      try {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } finally {
        // ダウンロード属性が効かない環境に備えて新規タブでも開く
        // （Android/iOS の一部ブラウザで有効）
        try { window.open(url, '_blank'); } catch {}
        // すぐ revoke すると表示前に無効化される可能性があるため遅延
        setTimeout(() => URL.revokeObjectURL(url), 10_000);
      }
    }, 'image/png');
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-screen">
      {/* 計測モードと同じUI/挙動 */}
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
