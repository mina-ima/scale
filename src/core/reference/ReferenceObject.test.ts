import { ReferenceObject, A4_PAPER, CREDIT_CARD } from './ReferenceObject';

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
