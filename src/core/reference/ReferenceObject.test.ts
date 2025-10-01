import {
  ReferenceObject,
  A4_PAPER,
  CREDIT_CARD,
  COIN_1_YEN,
  REFERENCE_OBJECTS,
} from './ReferenceObject';

describe('ReferenceObject Definitions', () => {
  it('A4_PAPER should have correct dimensions', () => {
    expect(A4_PAPER.name).toBe('A4 Paper');
    expect(A4_PAPER.widthMm).toBe(210);
    expect(A4_PAPER.heightMm).toBe(297);
  });

  it('CREDIT_CARD should have correct dimensions', () => {
    expect(CREDIT_CARD.name).toBe('Credit Card');
    expect(CREDIT_CARD.widthMm).toBe(85.6);
    expect(CREDIT_CARD.heightMm).toBe(53.98);
  });

  it('COIN_1_YEN should have correct dimensions', () => {
    expect(COIN_1_YEN.name).toBe('1 JPY Coin');
    expect(COIN_1_YEN.widthMm).toBe(20.0);
    expect(COIN_1_YEN.heightMm).toBe(20.0);
  });

  // Add a test for a generic ReferenceObject to ensure interface compatibility
  it('should allow creating a custom ReferenceObject', () => {
    const customObject: ReferenceObject = {
      name: 'Custom Object',
      widthMm: 100,
      heightMm: 50,
    };
    expect(customObject.name).toBe('Custom Object');
    expect(customObject.widthMm).toBe(100);
    expect(customObject.heightMm).toBe(50);
  });
});

describe('REFERENCE_OBJECTS table', () => {
  it('should contain all reference objects', () => {
    expect(REFERENCE_OBJECTS).toContain(A4_PAPER);
    expect(REFERENCE_OBJECTS).toContain(CREDIT_CARD);
    expect(REFERENCE_OBJECTS).toContain(COIN_1_YEN);
    expect(REFERENCE_OBJECTS.length).toBeGreaterThanOrEqual(3);
  });
});
