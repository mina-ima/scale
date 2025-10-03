import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

describe('App Routing', () => {
  it('renders HomePage on default route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('はかったけ')).toBeInTheDocument();
    expect(screen.getByText('ブラウザで手軽に測定・記録')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '計測モード' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: '成長記録モード' })
    ).toBeInTheDocument();
  });

  it('renders MeasurePage on /measure route', () => {
    render(
      <MemoryRouter initialEntries={['/measure']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('計測モード')).toBeInTheDocument();
    // Check for a unique element on the MeasurePage instead of the placeholder text
    expect(screen.getByTestId('measure-page-container')).toBeInTheDocument();
  });

  it('renders GrowthRecordPage on /growth-record route', () => {
    render(
      <MemoryRouter initialEntries={['/growth-record']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('成長記録モード')).toBeInTheDocument();
  });
});
