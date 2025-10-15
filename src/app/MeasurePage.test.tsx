import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import MeasurePage from './MeasurePage';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';

// Mock the useWebXR hook
vi.mock('../core/ar/useWebXR', () => ({
  useWebXR: vi.fn(() => ({
    isWebXRSupported: true,
    startARSession: vi.fn(),
    arSession: null,
    arRef: { current: null },
  })),
}));

// Mock the useCamera hook
vi.mock('../core/camera/useCamera', () => ({
  useCamera: vi.fn(() => ({
    stream: null,
    error: null,
    startCamera: vi.fn(),
    stopCamera: vi.fn(),
    facingMode: 'environment',
    toggleCameraFacingMode: vi.fn(),
  })),
}));

import * as measure from '../core/measure/calculate2dDistance';
import { type Mock, type MockInstance } from 'vitest';
import { isWebXRAvailable } from '../core/ar/webxrUtils';
import * as cameraUtils from '../core/camera/utils';

// Mock the render functions as they are not relevant to this test
vi.mock('../core/render/drawMeasurement');
vi.mock('../core/ar/webxrUtils');

// Mock URL.createObjectURL globally
vi.stubGlobal('URL', {
  createObjectURL: vi.fn(() => 'blob:test/image'),
});

const { mockMediaStream } = vi.hoisted(() => {
  const mockMediaStream = {
    getTracks: () => [],
  } as unknown as MediaStream;
  return { mockMediaStream };
});

// Mock camera utilities
const originalState = useMeasureStore.getState();

interface MockMeasureUIProps {
  onStartARSession: () => void;
  onToggleCameraFacingMode: () => void;
}

// Mock MeasureUIComponent
vi.mock('./MeasureUI', () => ({
  __esModule: true,
  default: function MockMeasureUI({
    onStartARSession,
    onToggleCameraFacingMode,
  }: MockMeasureUIProps) {
    const { measurement, unit, isWebXrSupported, isArMode, facingMode } =
      useMeasureStore();
    return (
      <div data-testid="measure-ui-mock">
        {measurement?.valueMm && (
          <p data-testid="measurement-display">
            {formatMeasurement(measurement.valueMm, unit)}
          </p>
        )}
        {isWebXrSupported && !isArMode && (
          <button data-testid="start-ar-button" onClick={onStartARSession}>
            AR計測を開始
          </button>
        )}
        <button
          data-testid="toggle-camera-button"
          onClick={onToggleCameraFacingMode}
        >
          カメラ切り替え (
          {facingMode === 'user' ? 'インカメラ' : 'アウトカメラ'})
        </button>
        <button
          data-testid="reset-button"
          onClick={(e) => {
            e.stopPropagation();
            useMeasureStore.getState().clearPoints();
          }}
        >
          リセット
        </button>
        <label>
          <input
            type="radio"
            value="cm"
            name="unit"
            data-testid="unit-cm"
            checked={unit === 'cm'}
            onChange={() => useMeasureStore.getState().setUnit('cm')}
          />{' '}
          cm
        </label>
        <label>
          <input
            type="radio"
            value="m"
            name="unit"
            data-testid="unit-m"
            checked={unit === 'm'}
            onChange={() => useMeasureStore.getState().setUnit('m')}
          />{' '}
          m
        </label>
        {!isWebXrSupported && (
          <p data-testid="webxr-not-supported-message">
            お使いの端末ではAR非対応です。写真で計測に切り替えます。
          </p>
        )}
      </div>
    );
  },
}));

describe('MeasurePage', () => {
  let spy: MockInstance;
  const mockIsWebXRAvailable = isWebXRAvailable as Mock;

  beforeEach(() => {
    // Reset the store and mocks before each test
    useMeasureStore.setState(originalState);
    spy = vi.spyOn(measure, 'calculate2dDistance');
    spy.mockReturnValue(1234.5); // e.g., 123.45 cm
    mockIsWebXRAvailable.mockResolvedValue(false); // Default mock

    // Add spies for cameraUtils
    vi.spyOn(cameraUtils, 'getCameraStream').mockResolvedValue(mockMediaStream);
    vi.spyOn(cameraUtils, 'stopCameraStream').mockImplementation(() => {});

    // Add ar-overlay div to body for portal
    const arOverlayRoot = document.createElement('div');
    arOverlayRoot.id = 'ar-overlay';
    document.body.appendChild(arOverlayRoot);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up ar-overlay div
    const arOverlayRoot = document.getElementById('ar-overlay');
    if (arOverlayRoot) {
      document.body.removeChild(arOverlayRoot);
    }
  });

  it('should calculate and display distance after two taps', async () => {
    useMeasureStore.getState().setScale({
      mmPerPx: 0.5,
      confidence: 1,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );
    const canvas = await screen.findByTestId('measure-canvas', undefined, {
      timeout: 10000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });

    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    const points = useMeasureStore.getState().points;
    const scale = useMeasureStore.getState().scale;
    expect(spy).toHaveBeenCalledWith(points[0], points[1], scale!.mmPerPx);

    expect(
      await screen.findByText('123.5 cm', undefined, { timeout: 10000 })
    ).toBeInTheDocument();
  }, 10000);

  it('should clear the measurement on the third tap and start a new one', async () => {
    useMeasureStore.getState().setScale({
      mmPerPx: 0.5,
      confidence: 1,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );
    const canvas = await screen.findByTestId('measure-canvas', undefined, {
      timeout: 10000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(
      await screen.findByText('123.5 cm', undefined, { timeout: 10000 })
    ).toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(2);

    fireEvent.click(canvas, { clientX: 300, clientY: 300 });

    expect(useMeasureStore.getState().points.length).toBe(1);
    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
  }, 10000);

  it('should display unit selection and default to cm', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );
    expect(
      await screen.findByLabelText('cm', undefined, { timeout: 10000 })
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText('m', undefined, { timeout: 10000 })
    ).toBeInTheDocument();
    expect(
      await screen.findByLabelText('cm', undefined, { timeout: 10000 })
    ).toBeChecked();
    expect(
      await screen.findByLabelText('m', undefined, { timeout: 10000 })
    ).not.toBeChecked();
  }, 10000);

  it('should change the displayed measurement unit when unit selection changes', async () => {
    // Set initial state directly in the store
    act(() => {
      useMeasureStore.setState({
        measurement: {
          mode: 'furniture',
          measurementMethod: 'fallback',
          valueMm: 1234.5,
          unit: 'cm',
          dateISO: new Date().toISOString(),
        },
        unit: 'cm',
      });
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );

    // Check initial state
    await waitFor(() => {
      expect(screen.getByText('123.5 cm')).toBeInTheDocument();
    });

    // Change unit
    fireEvent.click(screen.getByLabelText('m'));

    // Check for updated text
    await waitFor(() => {
      expect(screen.getByText('1.2 m')).toBeInTheDocument();
      expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
    });
  }, 10000);

  it('should render a reset button', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );
    expect(
      await screen.findByRole(
        'button',
        { name: 'リセット' },
        { timeout: 10000 }
      )
    ).toBeInTheDocument();
  }, 10000);

  it('should clear measurement and points when reset button is clicked', async () => {
    useMeasureStore.getState().setScale({
      mmPerPx: 0.5,
      confidence: 1,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );
    const canvas = await screen.findByTestId('measure-canvas', undefined, {
      timeout: 10000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(
      await screen.findByText('123.5 cm', undefined, { timeout: 10000 })
    ).toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(2);

    fireEvent.click(
      await screen.findByRole(
        'button',
        { name: 'リセット' },
        { timeout: 10000 }
      )
    );

    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(0);
  }, 10000);

  it('should display a message if WebXR is not supported', async () => {
    mockIsWebXRAvailable.mockResolvedValue(false);
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );
    await waitFor(
      () => {
        expect(
          screen.getByText(
            'お使いの端末ではAR非対応です。写真で計測に切り替えます。'
          )
        ).toBeInTheDocument();
      },
      { timeout: 10000 }
    );
  }, 10000);
});
