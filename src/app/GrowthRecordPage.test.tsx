import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import GrowthRecordPage from './GrowthRecordPage';

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
    expect(
      screen.getByTestId('growth-record-page-container-shinchou')
    ).toBeVisible();
    expect(
      screen.getByTestId('growth-record-page-container-ashi')
    ).not.toBeVisible();
    expect(
      screen.getByTestId('growth-record-page-container-te')
    ).not.toBeVisible();
    expect(screen.queryByText('体重入力')).not.toBeVisible(); // WeightInputForm is not visible initially
  });

  it('switches to the 足 tab and displays its content', () => {
    render(<GrowthRecordPage />);
    fireEvent.click(screen.getByRole('tab', { name: '足' }));
    expect(
      screen.getByTestId('growth-record-page-container-ashi')
    ).toBeVisible();
    expect(
      screen.getByTestId('growth-record-page-container-shinchou')
    ).not.toBeVisible();
  });

  it('switches to the 手 tab and displays its content', () => {
    render(<GrowthRecordPage />);
    fireEvent.click(screen.getByRole('tab', { name: '手' }));
    expect(screen.getByTestId('growth-record-page-container-te')).toBeVisible();
    expect(
      screen.getByTestId('growth-record-page-container-shinchou')
    ).not.toBeVisible();
  });

  it('switches to the 体重 tab and displays WeightInputForm', () => {
    render(<GrowthRecordPage />);
    fireEvent.click(screen.getByRole('tab', { name: '体重' }));
    expect(screen.getByText('体重入力')).toBeVisible();
    expect(screen.getByLabelText('体重 (kg):')).toBeVisible();
    expect(screen.getByLabelText('日付:')).toBeVisible();
    expect(
      screen.getByTestId('growth-record-page-container-shinchou')
    ).not.toBeVisible();
  });
});
