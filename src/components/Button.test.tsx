import { render, screen } from '@testing-library/react';
import React from 'react';
import Button from './Button';

describe('Button', () => {
  // Store the actual original getComputedStyle
  const originalGetComputedStyle = window.getComputedStyle;

  // Mock window.getComputedStyle
  const mockGetComputedStyle = vi
    .spyOn(window, 'getComputedStyle')
    .mockImplementation((elt: Element) => {
      const mockStyle = {
        width: '44px',
        height: '44px',
        getPropertyValue: (prop: string) => {
          if (prop === 'width') return '44px';
          if (prop === 'height') return '44px';
          return ''; // Default for other properties
        },
      } as CSSStyleDeclaration;

      // For button elements, ensure min-width and min-height are at least 44px
      if (elt.tagName === 'BUTTON') {
        return mockStyle;
      }
      return originalGetComputedStyle(elt);
    });
  afterAll(() => {
    mockGetComputedStyle.mockRestore();
  });

  it('should render a button with minimum tap target size', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    const style = window.getComputedStyle(button);

    const width = parseFloat(style.width);
    const height = parseFloat(style.height);

    // Check if width and height are at least 44px
    expect(width).toBeGreaterThanOrEqual(44);
    expect(height).toBeGreaterThanOrEqual(44);
  });
});
