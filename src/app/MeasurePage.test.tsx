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
    expect(screen.queryByText(/cm/)).not.toBeInTheDocument();

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
});