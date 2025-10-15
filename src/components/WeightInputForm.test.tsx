import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WeightInputForm from './WeightInputForm';

describe('WeightInputForm', () => {
  it('renders the weight input field and submit button', () => {
    render(<WeightInputForm onSubmit={() => {}} />);
    expect(screen.getByLabelText(/体重/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /記録/i })).toBeInTheDocument();
  });

  it('allows entering a weight value', () => {
    render(<WeightInputForm onSubmit={() => {}} />);
    const input = screen.getByLabelText(/体重/i);
    fireEvent.change(input, { target: { value: '15.5' } });
    expect(input).toHaveValue(15.5);
  });

  it('calls onSubmit with the correct weight when the form is submitted', () => {
    const handleSubmit = vi.fn();
    render(<WeightInputForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/体重/i);

    fireEvent.change(input, { target: { value: '16.2' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(16.2);
  });

  it('clears the input field after successful submission', () => {
    const handleSubmit = vi.fn();
    render(<WeightInputForm onSubmit={handleSubmit} />);
    const input = screen.getByLabelText(/体重/i);

    fireEvent.change(input, { target: { value: '17.0' } });
    fireEvent.submit(screen.getByRole('form'));

    expect(input).toHaveValue(null); // Input should be cleared
  });

  it('displays an error message for invalid input (e.g., non-numeric)', async () => {
    render(<WeightInputForm onSubmit={() => {}} />);
    const input = screen.getByLabelText(/体重/i);

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/有効な数値を入力してください/i)
      ).toBeInTheDocument();
    });
    expect(input).toHaveValue(null); // Input should be cleared
  });

  it('displays an error message for negative weight', async () => {
    render(<WeightInputForm onSubmit={() => {}} />);
    const input = screen.getByLabelText(/体重/i);

    fireEvent.change(input, { target: { value: '-5' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/体重は0より大きい値を入力してください/i)
      ).toBeInTheDocument();
    });
    expect(input).toHaveValue(null); // Input should be cleared
  });

  it('displays an error message for zero weight', async () => {
    render(<WeightInputForm onSubmit={() => {}} />);
    const input = screen.getByLabelText(/体重/i);

    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(
        screen.getByText(/体重は0より大きい値を入力してください/i)
      ).toBeInTheDocument();
    });
    expect(input).toHaveValue(null); // Input should be cleared
  });
});
