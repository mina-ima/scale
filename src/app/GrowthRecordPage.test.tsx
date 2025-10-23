import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import GrowthRecordPage from './GrowthRecordPage';

// Mock child components
vi.mock('./GrowthMeasurementTabContent', () => ({
  __esModule: true,
  default: vi.fn(({ mode }) => <div data-testid={`mock-growth-measurement-tab-content-${mode}`} />),
}));

vi.mock('../components/WeightInputForm', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="mock-weight-input-form" />),
}));

describe('GrowthRecordPage', () => {
  it('renders the Growth Record Page title', () => {
    render(<GrowthRecordPage />);
    expect(screen.getByText('成長記録モード')).toBeInTheDocument();
  });

  it('renders all tab labels', () => {
    render(<GrowthRecordPage />);
    expect(screen.getByRole('tab', { name: '身長' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '足' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '手' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '体重' })).toBeInTheDocument();
  });

  it('initially displays the 身長 tab content and hides others', () => {
    render(<GrowthRecordPage />);
    expect(screen.getByTestId('mock-growth-measurement-tab-content-shinchou')).toBeVisible();
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-ashi')).not.toBeVisible();
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-te')).not.toBeVisible();
    expect(screen.queryByTestId('mock-weight-input-form')).not.toBeVisible();
  });

  it('switches to the 足 tab and displays its content', () => {
    render(<GrowthRecordPage />);
    fireEvent.click(screen.getByRole('tab', { name: '足' }));
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-shinchou')).not.toBeVisible();
    expect(screen.getByTestId('mock-growth-measurement-tab-content-ashi')).toBeVisible();
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-te')).not.toBeVisible();
    expect(screen.queryByTestId('mock-weight-input-form')).not.toBeVisible();
  });

  it('switches to the 手 tab and displays its content', () => {
    render(<GrowthRecordPage />);
    fireEvent.click(screen.getByRole('tab', { name: '手' }));
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-shinchou')).not.toBeVisible();
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-ashi')).not.toBeVisible();
    expect(screen.getByTestId('mock-growth-measurement-tab-content-te')).toBeVisible();
    expect(screen.queryByTestId('mock-weight-input-form')).not.toBeVisible();
  });

  it('switches to the 体重 tab and displays WeightInputForm', () => {
    render(<GrowthRecordPage />);
    fireEvent.click(screen.getByRole('tab', { name: '体重' }));
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-shinchou')).not.toBeVisible();
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-ashi')).not.toBeVisible();
    expect(screen.queryByTestId('mock-growth-measurement-tab-content-te')).not.toBeVisible();
    expect(screen.getByTestId('mock-weight-input-form')).toBeVisible();
  });
});