import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MeasurePage from './MeasurePage';
import { useMeasureStore } from '../store/measureStore';
import * as measure from '../core/measure/calculate2dDistance';
import { Mock, mock, stubGlobal, fn, spyOn, useFakeTimers, restoreAllMocks, runOnlyPendingTimersAsync } from 'vitest';

// Mock the render functions as they are not relevant to this test
mock('../core/render/drawMeasurement');

// Mock URL.createObjectURL globally
stubGlobal('URL', {
  createObjectURL: fn(() => 'blob:test/image'),
});

const originalState = useMeasureStore.getState();

describe('MeasurePage', () => {
  let spy: SpyInstance;

  beforeEach(() => {
    // Reset the store and mocks before each test
    useMeasureStore.setState(originalState);
    spy = vi.spyOn(measure, 'calculate2dDistance');
    spy.mockReturnValue(1234.5); // e.g., 123.45 cm
    vi.useFakeTimers();
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

  it('should display a message if WebXR is not supported', () => {
    // Mock navigator.xr to be undefined
    Object.defineProperty(navigator, 'xr', {
      writable: true,
      value: undefined,
    });
    render(<MeasurePage />);
    expect(
      screen.getByText(
        'お使いの端末ではAR非対応です。写真で計測に切り替えます。'
      )
    ).toBeInTheDocument();
  });

  it('should not display a message if WebXR is supported', () => {
    // Mock navigator.xr to be an object (simulating support)
    Object.defineProperty(navigator, 'xr', {
      writable: true,
      value: {},
    });
    render(<MeasurePage />);
    expect(
      screen.queryByText(
        'お使いの端末ではAR非対応です。写真で計測に切り替えます。'
      )
    ).not.toBeInTheDocument();
  });

  it('should not display photo upload input if WebXR is supported (implying AR mode)', () => {
    // Mock navigator.xr to be an object (simulating support)
    Object.defineProperty(navigator, 'xr', {
      writable: true,
      value: {},
    });
    render(<MeasurePage />);
    expect(screen.queryByLabelText('写真を選択')).not.toBeInTheDocument();
  });

  it('should display photo upload input if WebXR is not supported', () => {
    // Mock navigator.xr to be undefined
    Object.defineProperty(navigator, 'xr', {
      writable: true,
      value: undefined,
    });
    render(<MeasurePage />);
    expect(screen.getByLabelText('写真を選択')).toBeInTheDocument();
  });

  it('should display the uploaded photo on the canvas', async () => {
    const mockImage = new Image();
    mockImage.src =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    const mockContext: Partial<CanvasRenderingContext2D> = {
      drawImage: vi.fn(),
      clearRect: vi.fn(),
    };

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockContext as CanvasRenderingContext2D
    );

    interface MockFileReader extends FileReader {
      readAsDataURL: Mock;
      onload:
        | ((this: FileReader, ev: ProgressEvent<FileReader>) => void)
        | null;
      result: string;
    }

    const mockFileReader: MockFileReader = {
      readAsDataURL: vi.fn(),
      onload: null,
      result: 'data:image/png;base64,mockedDataURL',
      abort: vi.fn(),
      error: null,
      onabort: null,
      onerror: null,
      onloadend: null,
      readyState: 0,
      onprogress: null,
      onloadstart: null,
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
      readAsArrayBuffer: vi.fn(),
      readAsBinaryString: vi.fn(),
      readAsText: vi.fn(),
      dispatchEvent: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, 'FileReader').mockImplementation(() => mockFileReader);

    render(<MeasurePage />);

    const fileInput = screen.getByLabelText('写真を選択');
    const file = new File(['(binary data)'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockFileReader.readAsDataURL).toHaveBeenCalledWith(file);

    // Manually trigger the onload event of the mocked FileReader
    mockFileReader.onload!({
      target: { result: mockFileReader.result },
    } as ProgressEvent<FileReader>);

    // Wait for the image to load and be drawn
    await vi.runOnlyPendingTimersAsync();

    expect(mockContext.drawImage).toHaveBeenCalledWith(
      expect.any(HTMLImageElement),
      0,
      0,
      expect.any(Number),
      expect.any(Number)
    );
  });
});
