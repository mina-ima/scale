はかったけ（測っ丈） 開発仕様 v1.0
最終更新: 2025-09-29
要約（結論）
ブラウザだけで動く二本柱「計測モード（家具・部屋）」と「成長記録モード（身長/足/手/体重）」のWebアプリを、完全クライアントサイドで実装する。WebXR対応時はAR計測、非対応時は写真＋基準物補正に自動切替。保存は端末ギャラリーのみ、クラウド送信なし。無料枠スタック（Vercel + JS/TS + Three.js 等）で構築し、実装開始に必要な設計・型・UI遷移・誤差補正手法・例外処理・E2E/性能テスト計画まで本仕様で確定する。

1. 目的・背景
   家庭/日常で手軽に寸法計測・成長記録を行う、インストール不要のWebアプリを提供する。
   家具/部屋: 最長 10m。成長記録: 身長/足/手は計測、体重は入力（kg、小数1桁）。
   オンライン前提。WebXR非対応や権限拒否時はフォールバックを自動適用。
2. スコープ
   含む: 計測/記録の実装、基準物によるスケール補正、単位切替、画像合成保存、UI/アクセシビリティ、エラー/例外処理、テスト。
   含まない（将来）: 他通貨基準物、PWA、複数線/面積/角度、SNS共有。
3. ユーザー/ユースケース
   保護者の成長記録、引越し/模様替えの寸法確認、DIYの簡易測定。
   代表ユースケース:
   家具の幅を測る → 数値を画面に重畳表示、スクショ/保存不要。
   子どもの身長を測る → 数値+日付入りの画像を自動保存。
4. 要件（機能）
   4.1 モード選択
   トップで「計測モード」「成長記録モード」から選択。
   4.2 計測モード（家具・部屋）

- WebXRの利用可能性チェック機能 (`isWebXRAvailable`) を実装済み。
- WebXRセッション開始/終了機能 (`startXrSession`) を実装済み。（エラーメッセージ詳細化済み）
- ヒットテスト初期化機能 (`initHitTestSource`) を実装済み。
- レイキャストによる3D点取得機能 (`get3dPointFromHitTest`) を実装済み。
- 平面検出機能 (`detectPlane`) を実装済み。
- 座標安定化機能 (`stabilizePoint`) を実装済み。
- WebXR非対応/失敗時のフォールバック自動切替機能 (`handleWebXRFallback`) を実装済み。
- 基準物検出失敗時のヒント/再撮影導線機能 (`getReferenceObjectDetectionMessage`) を実装済み。
- 平面未検出時のガイド表示機能 (`getPlaneDetectionMessage`) を実装済み。
- ユーザーはデバイスのカメラを通して現実空間を認識し、ARで仮想的な測定ツールを配置できます。
- 2点間の距離をリアルタイムで測定し、画面上に表示します。
- 測定結果は一時的なものであり、保存されません。
- **注意文言とヒント**: 状況に応じた注意文言とヒント (`getMeasurementHint`) を表示します。
  カメラ起動後、2点タップで距離算出。表示は小数1桁（例: 145.3 cm）。
  単位: cm/m 切替。常に計測線は1本。新規計測で既存は消去。
  最大 10m。モード入場時に注意表示。
  保存機能なし（画面表示のみ）。
  4.3 成長記録モード
  項目: 身長/足/手（計測）、体重（手入力、小数1桁、kg固定）。
  計測方式は計測モードと同等（基準物補正対応）。
  日付: 端末日付の自動取得 + 手動修正可（過去記録OK）。

#### 3.2.3. 測定値、日付、画像を合成した記録画像の自動生成と保存

- 画像保存失敗時のリトライ機能 (`saveImageWithRetry`) を実装済み。
- 測定された身長、足のサイズ、手のサイズ、手動入力された体重、測定日、そして測定時の画像を1枚の画像に合成します。
- 合成された画像は、ユーザーのデバイスのギャラリーに自動的に保存されます。
  画像合成要素: 計測線/数値/日付。文字は白（背景が明るい時は黒）。
  ファイル名: hakattake*YYYY-MM-DD*[項目]\_[数値+単位].jpg
  保存先: 端末ギャラリーのみ（共有なし）。
  4.4 精度補正（基準物）
  対応: A4/クレカ/硬貨(1/5/10/50/100/500)/紙幣(1000/2000/5000/10000)。
  自動検出時に「補正に使いますか？」ダイアログ → OKでスケール更新。
  未検出時は補正なし継続。
  計測画面にヒント: 「A4や硬貨を一緒に映すと精度アップ！」

5. 非機能要件
   精度目標:
   AR方式: 5m以内 ±1〜3cm
   基準物補正: ±1〜2cm
   性能: 計測時 24fps以上、初回ロード ≤5s（3G相当）。
   セキュリティ: カメラ処理は端末内のみ。保存は端末のみ。クラウド送信なし。
   アクセシビリティ: 明暗に応じた文字色自動切替、文字サイズ拡大対応。
6. アーキテクチャ
   6.1 全体構成
   クライアントのみ（Serverless）
   Hosting: Vercel（静的配信）
   Framework: Vite + React（または Preact） + TypeScript
   3D/AR: WebXR + Three.js（ARモード）、フォールバックで2D画像処理
   状態管理: Zustand（軽量）/React Query（非同期）
   ビルドターゲット: 最新Chrome Android優先
   6.2 モジュール分割
   core/camera : カメラ起動、権限、ストリーム制御
   core/ar : WebXR起動、平面検出、レイキャスト、ポーズ取得
   core/fallback : 画像撮影/ギャラリー保存、2点タップ、射影変換
   core/reference : 基準物検出（輪郭/特徴量）とスケール推定
   core/measure : 2点間距離計算（3D/2D）、単位変換、丸め
   core/render : オーバーレイ描画（計測線・ラベル・日付）
   features/growth : 成長記録フロー、ファイル名生成、画像合成
   ui : 画面/コンポーネント（モード選択、測定UI、設定）
   utils : Exif/色推定/端末日付/ガード
   6.3 データフロー
   起動 → 環境判定（WebXR可/不可）。
   AR可: セッション開始 → 平面ヒット → スタート/エンドをレイで取得 → 3D距離。
   AR不可: 写真取得 → 基準物推定で 1px あたりの現実長（mm/px） → 2点を画像座標で距離算出。
   成長記録モードは確定時にCanvas合成 → 画像保存。
   6.4 端末権限/互換
   navigator.mediaDevices.getUserMedia、navigator.xr
   XR失敗/権限拒否時はフォールバック起動。
7. 主要アルゴリズム
   7.1 2点計測
   AR: XRRay で平面ヒットの3D座標 p1, p2 を取得、距離 d = ||p2 - p1||。
   フォールバック: 画像座標 (x1,y1),(x2,y2)、スケール s[mm/px] → d_mm = s * sqrt((dx)^2+(dy)^2)。
   7.2 スケール推定（基準物）
   入力: 画像、候補クラス（A4/硬貨/紙幣/クレカ）。
   検出:
   矩形/円の輪郭抽出（Canny→Hough/輪郭近似）、アスペクト比/サイズでフィルタ。
   紙幣・A4は四角検出 + 射影補正；硬貨は円検出。
   一致判定: クラス毎の 実寸 テンプレートとスコアリング。
   スケール: 検出領域の画素長 ÷ 実寸 → mm/px を得る。
   品質: しきい値以下の信頼度時は非適用、再案内。
   ※ 実寸テーブル例（mm）
   A4: 210×297
   クレカ: 85.60×53.98
   硬貨: 1円20.0、5円22.0、10円23.5、50円21.0、100円22.6、500円26.5
   紙幣: 1000/5000/10000= 76×150、2000= 76×154（最新券/旧券差は許容誤差内で扱う）
   7.3 表示/丸め/単位
   表示は小数1桁。内部計算はdouble精度、最終表示で Math.round(v*10)/10。
   単位切替: ベースをmmとし、cm = mm/10, m = mm/1000。
   7.4 画像合成（成長記録）
   HTMLCanvasでオーバーレイをレイヤ合成（計測線→ラベル→日付→枠）。
   文字色は背景局所輝度で黒/白自動選択（YUV/HSVのYで判定）。
   canvas.toBlob({type:'image/jpeg', quality:0.92}) で保存。
8. データ設計
   8.1 型（TypeScript）
   // 計測対象モード
   export type MeasureMode = 'furniture' | 'growth-height' | 'growth-foot' | 'growth-hand' | 'growth-weight';

export interface MeasurementResult {
mode: MeasureMode;
valueMm?: number; // 体重以外
valueKg?: number; // 体重
unit: 'mm' | 'cm' | 'm' | 'kg';
dateISO: string; // YYYY-MM-DD
image?: Blob; // 成長記録のみ合成画像
}

export interface ScaleEstimation {
source: 'none' | 'a4' | 'credit' | 'coin-1' | 'coin-5' | 'coin-10' | 'coin-50' | 'coin-100' | 'coin-500' | 'bill-1000' | 'bill-2000' | 'bill-5000' | 'bill-10000';
mmPerPx: number; // 推定スケール
confidence: number; // 0..1
}

export interface ErrorState {
code: 'CAMERA*DENIED' | 'XR_UNAVAILABLE' | 'PLANE_NOT_FOUND' | 'SAVE_FAILED' | 'UNKNOWN';
message: string;
}
8.2 ファイル命名
hakattake_YYYY-MM-DD*[項目]\_[数値+単位].jpg
項目キー: shinchou|ashi|te|taijuu
8.3 永続化/通信
通信なし（分析/ログ送信を行わない）。
ローカルのみ（画像保存API/ダウンロード）9. UI/UX設計
9.1 画面構成
トップ: 2ボタン（計測/成長記録）。
計測:
下中央: 計測開始/終了
左下: 単位切替
右下: 保存ボタン非表示（このモードは保存しない）
オーバーレイ: 計測線（端点円）+ 数値ラベル
注意: 「最大10mまで測定可能です」
成長記録:
サブタブ: 身長/足/手/体重
計測UIは計測モードと同様。体重は数値入力+確定。
保存UI: 自動保存、トーストで結果表示
画像には日付を埋め込み
9.2 アクセシビリティ
文字サイズ拡大を CSS 相対単位で適用。
輝度検出で文字色自動切替。
触りやすいタップ領域（最低 44px）。10. エラーハンドリング & リカバリ
事象 検知 表示/誘導 リカバリ ログ
カメラ権限拒否 getUserMedia 例外 「カメラ権限を許可してください」再試行ボタン 設定/再試行 Console のみ（送信なし）
WebXR非対応 navigator.xr なし/失敗 「お使いの端末ではAR非対応です。写真で計測に切替」 自動でフォールバック起動 Console
平面検出不可 ヒットテスト 0 件 「床や壁を映してください」 ガイドオーバーレイ表示 Console
保存失敗 toBlob/save 失敗 「保存できません（容量不足等）」 画像品質/解像度下げて再試行 Console
基準物検出失敗 信頼度 < T 「基準物を再度はっきり写してください」 連続撮影/露出ガイド Console
最大距離超過 距離>10m 「10mを超える計測は非対応」 2点目拒否 Console
例外は ErrorBoundary と core/\* のトライキャッチで握り、ユーザー向けはトースト/ダイアログ、開発向けは console。（ErrorBoundary実装済み）11. セキュリティ/プライバシー
画像/映像は端末内処理のみ。クラウド送信/解析なし。
画像保存はユーザー操作（または自動保存）時のみ発生。
追跡Cookieや外部分析SDKは使用しない。12. 実装計画
12.1 ディレクトリ構成（提案）
src/
app/ // ルーティング、ページ
components/ // UIコンポーネント
core/
ar/
camera/
fallback/
measure/
reference/
render/
features/
growth/
styles/
utils/
12.2 主要タスク
起動/環境判定と2モードの骨格
カメラ/ARパイプライン（ARヒット→2点測距）
フォールバック: 撮影→基準物検出→スケール→2点測距
成長記録: 合成・命名・保存
単位/丸め/距離ガード、UIポリッシュ
エラー/リカバリ/ヒント
パフォーマンス最適化（24fps）
QA/E2E/端末検証
12.3 外部依存（最小）
Three.js, @types/webxr, Zustand, html2canvas もしくは Canvas API のみ
画像処理は可能な限り自前（輪郭抽出は opencv.js 検討可。ただしバンドル増大に留意）13. テスト計画
13.1 単体テスト（Jest）
丸め/単位変換/ファイル名生成/日付/ガード
2D距離計算、スケール適用
スケール推定: テンプレ一致（モック画像）信頼度判定
13.2 結合テスト（Playwright）
起動→権限拒否→フォールバック確認
AR可端末: 平面検出→2点→表示小数1桁
フォールバック: A4/硬貨認識→補正→距離
成長記録: 身長計測→画像自動保存→命名規則
体重: 入力→小数1桁→保存
10m超過エラー、再計測で線が1本のみ
13.3 端末/環境マトリクス
必須: Android/Chrome 最新、解像度別（HD/FHD/WQHD）
参考: iOS/Safari(一部制限)、低速回線（3G）
13.4 性能テスト
初回ロード ≤5s（3G）: Lighthouse/Network throttle
計測時 24fps: requestAnimationFrame 計測、負荷時の描画間引き
13.5 受入基準（サンプル）
ARで 3m の棒を ±3cm 以内で再現（平均5回）
A4補正時、実測1m を ±10mm 以内
自動保存画像に数値/日付が欠落しない14. エンドツーエンドの擬似コード
// 起動
if (supportsWebXR()) startArSession(); else startFallback();

// 計測
onTapStart(point) { state.p1 = point; }
onTapEnd(point) {
state.p2 = point;
const d = computeDistance(state.p1, state.p2, scale);
renderOverlay(d);
}

// 基準物検出→スケール
const ref = detectReference(image);
if (ref && ref.confidence > THRESH) scale = ref.mmPerPx;

// 成長記録 保存
if (mode in ['growth-height','growth-foot','growth-hand','growth-weight']) {
const composed = composeCanvas(baseFrame, overlay, dateStr);
saveToGallery(composed, makeFilename(mode, value, dateStr));
} 15. リスクと緩和
基準物検出の誤認: 信頼度しきい値を高め、ユーザー確認ダイアログを維持。
バンドル肥大: 画像処理を必要最小限、opencv.js はオプション導入。
ARヒット不安定: ガイドUI/露出調整、ヒット平均化/中央値フィルタ。
保存API差異: Web Share / File System Access の差異に対し複数フォールバック実装。16. デプロイ/運用
Vercelに main ブランチで auto-deploy。PRごとに Preview。
監視はブラウザ Console のみ（送信なし）。ユーザー問い合わせ用にFAQ/ヘルプを用意。17. 将来拡張のフック
Feature Flag で PWA/複数線/面積を段階的に有効化。
i18n 基盤（キー/辞書）を準備し、日本語→多言語展開。
付録A: 実寸テーブル（mm）
A4: 210×297
クレカ: 85.60×53.98
硬貨: 1円20.0、5円22.0、10円23.5、50円21.0、100円22.6、500円26.5
紙幣: 1000/5000/10000= 76×150、2000= 76×154
付録B: API/ブラウザ機能
WebXR, WebGL/Three.js, MediaDevices.getUserMedia, Canvas 2D, File System Access（対応時）
