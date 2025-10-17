// 基準物の実寸（mm）テーブル。
// 写真上で 2 点タップした区間を、ここに定義した既知の長さ(mm)に合わせて校正します。
// UI 側からは key を指定して mm を取得する想定。

export type ReferenceKey =
  | 'credit-card-width'
  | 'credit-card-height'   // ★追加：カード縦幅
  | 'a4-width'
  | 'a4-height'
  | 'coin-1'
  | 'coin-5'
  | 'coin-10'
  | 'coin-50'
  | 'coin-100'
  | 'coin-500'
  | 'note-1000-width'
  | 'note-2000-width'
  | 'note-5000-width'
  | 'note-10000-width'     // ★追加：一万円札の横幅
  ;

export interface ReferenceItem {
  key: ReferenceKey;
  /** UI 表示用ラベル */
  label: string;
  /** 実寸（mm） */
  mm: number;
}

/**
 * 代表的な基準物の寸法（mm）
 * - クレジットカード（ISO/IEC 7810 ID-1）：85.60mm × 53.98mm
 * - A4（ISO 216）：210mm × 297mm
 * - 日本硬貨：直径（1円=20.0, 5円=22.0, 10円=23.5, 50円=21.0, 100円=22.6, 500円=26.5）
 * - 日本紙幣（現行券・横幅）：1000/5000/10000=150mm, 2000=154mm
 *
 * 注：公称値ベース。実物の摩耗や撮影角度・レンズ歪みで誤差が出ます。
 */
export const REFERENCE_LIST: readonly ReferenceItem[] = [
  { key: 'credit-card-width',  label: 'クレジットカードの横幅（85.60mm）', mm: 85.6 },
  { key: 'credit-card-height', label: 'クレジットカードの縦幅（53.98mm）', mm: 53.98 }, // ★追加

  { key: 'a4-width',  label: 'A4 短辺（210mm）', mm: 210 },
  { key: 'a4-height', label: 'A4 長辺（297mm）', mm: 297 },

  { key: 'coin-1',   label: '1円硬貨 直径（20.0mm）',  mm: 20.0 },
  { key: 'coin-5',   label: '5円硬貨 直径（22.0mm）',  mm: 22.0 },
  { key: 'coin-10',  label: '10円硬貨 直径（23.5mm）', mm: 23.5 },
  { key: 'coin-50',  label: '50円硬貨 直径（21.0mm）', mm: 21.0 },
  { key: 'coin-100', label: '100円硬貨 直径（22.6mm）', mm: 22.6 },
  { key: 'coin-500', label: '500円硬貨 直径（26.5mm）', mm: 26.5 },

  { key: 'note-1000-width',  label: '千円札の横幅（150mm）',  mm: 150 },
  { key: 'note-2000-width',  label: '二千円札の横幅（154mm）', mm: 154 },
  { key: 'note-5000-width',  label: '五千円札の横幅（150mm）', mm: 150 },
  { key: 'note-10000-width', label: '一万円札の横幅（160mm）', mm: 160 }, // ★修正: 実寸160mm
] as const;

/** key → ReferenceItem の検索用マップ */
export const REFERENCE_MAP: Readonly<Record<ReferenceKey, ReferenceItem>> = REFERENCE_LIST
  .reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {} as Record<ReferenceKey, ReferenceItem>);

/** key から mm を取得（見つからなければ undefined） */
export function getReferenceMm(key: ReferenceKey): number | undefined {
  return REFERENCE_MAP[key]?.mm;
}

/** UI 用：セレクトボックスに並べるときの配列（そのまま export） */
export function getReferenceOptions(): ReadonlyArray<ReferenceItem> {
  return REFERENCE_LIST;
}
