// src/core/geometry/homography.ts
// 4点対応からホモグラフィを推定し、画像座標 (px) を基準平面座標 (mm) へ射影します。
// 実装は 8x8 連立一次方程式（h33=1 でスケール固定）をガウス消去で解く簡約DLT。
// 入力点の順序は [左上, 右上, 右下, 左下] を推奨（歪み低減・安定化のため）。

export type Vec2 = { x: number; y: number };

/** 行列 H を row-major（長さ9）で保持: [h11,h12,h13,h21,h22,h23,h31,h32,h33] */
export type Homography = number[];

/** 数値の有限性チェック */
function isFiniteNumber(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n);
}

/** ガウス消去（部分ピボット）で Ax=b を解く。A: n×n, b: n。 */
function solveLinearSystem(A: number[][], b: number[]): number[] {
  const n = A.length;
  // 拡大行列 [A | b]
  for (let i = 0; i < n; i++) {
    A[i] = A[i].slice(); // defensive copy
    A[i].push(b[i]);
  }

  // 前進消去
  for (let col = 0; col < n; col++) {
    // ピボット選択（最大値）
    let pivotRow = col;
    let maxAbs = Math.abs(A[col][col]);
    for (let r = col + 1; r < n; r++) {
      const val = Math.abs(A[r][col]);
      if (val > maxAbs) {
        maxAbs = val;
        pivotRow = r;
      }
    }
    if (maxAbs === 0) throw new Error('Singular matrix');

    // 行入替
    if (pivotRow !== col) {
      const tmp = A[col];
      A[col] = A[pivotRow];
      A[pivotRow] = tmp;
    }

    // ピボットを1に正規化
    const pivot = A[col][col];
    for (let c = col; c <= n; c++) {
      A[col][c] /= pivot;
    }

    // 下を0に
    for (let r = col + 1; r < n; r++) {
      const factor = A[r][col];
      if (factor === 0) continue;
      for (let c = col; c <= n; c++) {
        A[r][c] -= factor * A[col][c];
      }
    }
  }

  // 後退代入
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = A[i][n];
    for (let j = i + 1; j < n; j++) sum -= A[i][j] * x[j];
    x[i] = sum; // 係数は1になっている
  }
  return x;
}

/**
 * 4点対応からホモグラフィ H を推定する。
 * src[i]（画像px）→ dst[i]（平面mm） の対応を 4組 与える。
 * 返り値: row-major の H（長さ9）。Hは任意スケールなので h33=1 に固定。
 *
 * 数学：
 * [ x y 1 0 0 0 -xX -yX ] [h11..h32]^T = X
 * [ 0 0 0 x y 1 -xY -yY ]                = Y
 * 求めた 8変数から H=[[h11 h12 h13],[h21 h22 h23],[h31 h32 1]]
 */
export function computeHomography(src: Vec2[], dst: Vec2[]): Homography {
  if (src.length !== 4 || dst.length !== 4) {
    throw new Error('computeHomography: requires exactly 4 point pairs');
  }
  // 入力妥当性
  for (let i = 0; i < 4; i++) {
    const s = src[i], d = dst[i];
    if (!isFiniteNumber(s.x) || !isFiniteNumber(s.y) ||
        !isFiniteNumber(d.x) || !isFiniteNumber(d.y)) {
      throw new Error('computeHomography: non-finite coordinate');
    }
  }

  // 8x8 の A, 8 の b を構築（h33=1 とするので未知数は8個）
  const A: number[][] = Array.from({ length: 8 }, () => new Array(8).fill(0));
  const b: number[] = new Array(8).fill(0);

  for (let i = 0; i < 4; i++) {
    const { x, y } = src[i];
    const { x: X, y: Y } = dst[i];
    const r = 2 * i;

    // X 行
    A[r][0] = x;
    A[r][1] = y;
    A[r][2] = 1;
    A[r][3] = 0;
    A[r][4] = 0;
    A[r][5] = 0;
    A[r][6] = -x * X;
    A[r][7] = -y * X;
    b[r] = X;

    // Y 行
    A[r + 1][0] = 0;
    A[r + 1][1] = 0;
    A[r + 1][2] = 0;
    A[r + 1][3] = x;
    A[r + 1][4] = y;
    A[r + 1][5] = 1;
    A[r + 1][6] = -x * Y;
    A[r + 1][7] = -y * Y;
    b[r + 1] = Y;
  }

  // 8未知数を解く
  const h = solveLinearSystem(A, b); // [h11,h12,h13,h21,h22,h23,h31,h32]
  const H: Homography = [
    h[0], h[1], h[2],
    h[3], h[4], h[5],
    h[6], h[7], 1,
  ];

  // 最小の健全性チェック
  if (!isValidHomography(H)) {
    throw new Error('computeHomography: invalid H (degenerate configuration?)');
  }
  return H;
}

/** H の健全性チェック（有限数 & h33 != 0） */
export function isValidHomography(H: Homography | null | undefined): H is Homography {
  if (!H || H.length !== 9) return false;
  for (const v of H) if (!isFiniteNumber(v)) return false;
  return Math.abs(H[8]) > 1e-12;
}

/** p' = H · p を計算（同次座標 → 直交座標）。返り値は {x,y}。 */
export function applyHomography(H: Homography, p: Vec2): Vec2 {
  const x = p.x, y = p.y;
  const hx = H[0] * x + H[1] * y + H[2];
  const hy = H[3] * x + H[4] * y + H[5];
  const hw = H[6] * x + H[7] * y + H[8];
  if (Math.abs(hw) < 1e-12) {
    // ほぼ無限遠に飛ぶケースは避ける
    return { x: NaN, y: NaN };
  }
  return { x: hx / hw, y: hy / hw };
}

/** 2点を H で射影し、平面座標(mm)でのユークリッド距離を返す。 */
export function distanceWithHomography(H: Homography, a: Vec2, b: Vec2): number {
  const a2 = applyHomography(H, a);
  const b2 = applyHomography(H, b);
  return Math.hypot(a2.x - b2.x, a2.y - b2.y);
}

/** 4隅の順序をガイドするヘルパ（左上→右上→右下→左下） */
export function sortCornersClockwise(corners: Vec2[]): Vec2[] {
  if (corners.length !== 4) return corners.slice();
  // 重心で分割し、角度でソート
  const cx = corners.reduce((s, p) => s + p.x, 0) / 4;
  const cy = corners.reduce((s, p) => s + p.y, 0) / 4;
  return corners
    .map(p => ({ p, ang: Math.atan2(p.y - cy, p.x - cx) }))
    .sort((a, b) => a.ang - b.ang)
    .map(o => o.p);
}

/** 矩形（幅w, 高さh）を mm 平面で [左上, 右上, 右下, 左下] に並べる */
export function rectMmCorners(w: number, h: number): Vec2[] {
  return [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
}
