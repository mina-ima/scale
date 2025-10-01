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
