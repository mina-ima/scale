export interface ReferenceObject {
  name: string;
  widthMm: number;
  heightMm: number;
}

export const A4_PAPER: ReferenceObject = {
  name: 'A4 Paper',
  widthMm: 210,
  heightMm: 297,
};

export const CREDIT_CARD: ReferenceObject = {
  name: 'Credit Card',
  widthMm: 85.6,
  heightMm: 53.98,
};

// JPY Coins
export const COIN_1_YEN: ReferenceObject = {
  name: '1 JPY Coin',
  widthMm: 20.0,
  heightMm: 20.0,
};
export const COIN_5_YEN: ReferenceObject = {
  name: '5 JPY Coin',
  widthMm: 22.0,
  heightMm: 22.0,
};
export const COIN_10_YEN: ReferenceObject = {
  name: '10 JPY Coin',
  widthMm: 23.5,
  heightMm: 23.5,
};
export const COIN_50_YEN: ReferenceObject = {
  name: '50 JPY Coin',
  widthMm: 21.0,
  heightMm: 21.0,
};
export const COIN_100_YEN: ReferenceObject = {
  name: '100 JPY Coin',
  widthMm: 22.6,
  heightMm: 22.6,
};
export const COIN_500_YEN: ReferenceObject = {
  name: '500 JPY Coin',
  widthMm: 26.5,
  heightMm: 26.5,
};

export const REFERENCE_OBJECTS: ReferenceObject[] = [
  A4_PAPER,
  CREDIT_CARD,
  COIN_1_YEN,
  COIN_5_YEN,
  COIN_10_YEN,
  COIN_50_YEN,
  COIN_100_YEN,
  COIN_500_YEN,
];
