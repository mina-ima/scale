/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MeasurePage from './MeasurePage';
import { useMeasureStore } from '../store/measureStore';
import * as measure from '../core/measure/calculate2dDistance';
import { vi } from 'vitest';

// Mock the render functions as they are not relevant to this test
vi.mock('../core/render/drawMeasurement');

const originalState = useMeasureStore.getState();

describe('MeasurePage', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    // Reset the store and mocks before each test
    useMeasureStore.setState(originalState);
    spy = vi.spyOn(measure, 'calculate2dDistance');
    spy.mockReturnValue(1234.5); // e.g., 123.45 cm
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should calculate and display distance after two taps', () => {
    useMeasureStore.getState().setScale({
      source: 'a4',
      mmPerPx: 0.5,
      confidence: 1,
    });

    render(<MeasurePage />);
    const canvas = screen.getByTestId('measure-canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });

    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    const points = useMeasureStore.getState().points;
    const scale = useMeasureStore.getState().scale;
    expect(spy).toHaveBeenCalledWith(points[0], points[1], scale!.mmPerPx);

    expect(screen.getByText('123.5 cm')).toBeInTheDocument();
  });

  it('should clear the measurement on the third tap and start a new one', () => {
    useMeasureStore.getState().setScale({
      source: 'a4',
      mmPerPx: 0.5,
      confidence: 1,
    });

    render(<MeasurePage />);
    const canvas = screen.getByTestId('measure-canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(screen.getByText('123.5 cm')).toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(2);

    fireEvent.click(canvas, { clientX: 300, clientY: 300 });

    expect(useMeasureStore.getState().points.length).toBe(1);
    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
  });

  it('should display unit selection and default to cm', () => {
    render(<MeasurePage />);
    expect(screen.getByLabelText('cm')).toBeInTheDocument();
    expect(screen.getByLabelText('m')).toBeInTheDocument();
    expect(screen.getByLabelText('cm')).toBeChecked();
    expect(screen.getByLabelText('m')).not.toBeChecked();
  });

  it('should change the displayed measurement unit when unit selection changes', () => {
    useMeasureStore.getState().setScale({
      source: 'a4',
      mmPerPx: 0.5,
      confidence: 1,
    });

    render(<MeasurePage />);
    const canvas = screen.getByTestId('measure-canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(screen.getByText('123.5 cm')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('m'));
    expect(screen.getByText('1.2 m')).toBeInTheDocument();
    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('cm'));
    expect(screen.getByText('123.5 cm')).toBeInTheDocument();
    expect(screen.queryByText('1.2 m')).not.toBeInTheDocument();
  });

  it('should render a reset button', () => {
    render(<MeasurePage />);
    expect(
      screen.getByRole('button', { name: 'リセット' })
    ).toBeInTheDocument();
  });

  it('should clear measurement and points when reset button is clicked', () => {
    useMeasureStore.getState().setScale({
      source: 'a4',
      mmPerPx: 0.5,
      confidence: 1,
    });

    render(<MeasurePage />);
    const canvas = screen.getByTestId('measure-canvas');

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(screen.getByText('123.5 cm')).toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(2);

    fireEvent.click(screen.getByRole('button', { name: 'リセット' }));

    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(0);
  });
});
