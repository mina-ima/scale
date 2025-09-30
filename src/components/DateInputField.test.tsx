import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DateInputField from './DateInputField';

describe('DateInputField', () => {
  it('renders with a label and input', () => {
    render(
      <DateInputField
        label="Test Date"
        value="2023-01-01"
        onChange={() => {}}
        id="test-date"
      />
    );
    expect(screen.getByLabelText('Test Date')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument();
  });

  it('calls onChange when date is changed', () => {
    const handleChange = vi.fn();
    render(
      <DateInputField
        label="Test Date"
        value="2023-01-01"
        onChange={handleChange}
        id="test-date"
      />
    );
    const dateInput = screen.getByLabelText('Test Date');
    fireEvent.change(dateInput, { target: { value: '2023-01-02' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('applies required attribute when true', () => {
    render(
      <DateInputField
        label="Required Date"
        value=""
        onChange={() => {}}
        required={true}
        id="required-date"
      />
    );
    expect(screen.getByLabelText('Required Date')).toBeRequired();
  });

  it('does not apply required attribute when false', () => {
    render(
      <DateInputField
        label="Optional Date"
        value=""
        onChange={() => {}}
        required={false}
        id="optional-date"
      />
    );
    expect(screen.getByLabelText('Optional Date')).not.toBeRequired();
  });
});
