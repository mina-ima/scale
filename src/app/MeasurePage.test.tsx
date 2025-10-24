import React, { Suspense } from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from '@testing-library/react';
import { vi } from 'vitest';
import { CanvasRenderingContext2D } from 'canvas';
import MeasurePage from './MeasurePage';
import { useMeasureStore } from '../store/measureStore';
import { formatMeasurement } from '../core/measure/format';
import * as THREE from 'three';
import { createRenderLoop } from '../core/ar/renderLoopUtils';

let capturedRenderLoop:
  | ((timestamp: number, frame: XRFrame) => void)
  | undefined;
const mockSetAnimationLoop = vi.fn((callback) => {
  capturedRenderLoop = callback;
});
const mockWebGLRendererInstance = {
  xr: {
    enabled: true,
    setSession: vi.fn(),
    isPresenting: true,
    getReferenceSpace: vi.fn(() => ({})),
  },
  setSize: vi.fn(),
  render: vi.fn(),
  setAnimationLoop: mockSetAnimationLoop,
  domElement: document.createElement('canvas'),
};

vi.mock('three', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    WebGLRenderer: vi.fn(() => mockWebGLRendererInstance),
  };
});

const mockXrSession = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  requestReferenceSpace: vi.fn(() => Promise.resolve({})),
} as unknown as XRSession;

const mockStartARSession = vi.fn(async () => {
  // Simulate successful session request
  return Promise.resolve(mockXrSession);
});

// Mock the useWebXR hook
vi.mock('../core/ar/useWebXR', () => ({
  useWebXR: vi.fn(() => ({
    isWebXRSupported: true,
    startARSession: mockStartARSession,
    arSession: mockXrSession,
    arRef: { current: null },
  })),
}));

// Mock the useCamera hook
vi.mock('../core/camera/useCamera', () => ({
  useCamera: vi.fn(() => ({
    stream: mockMediaStream,
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
vi.mock('../core/ar/webxrUtils', () => ({
  isWebXRAvailable: vi.fn(() => Promise.resolve(true)),
}));
import * as cameraUtils from '../core/camera/utils';

import * as scaleEstimator from '../core/reference/ScaleEstimation';

// Mock the render functions as they are not relevant to this test
import * as drawMeasurement from '../core/render/drawMeasurement';

vi.mock('../core/reference/ScaleEstimation', () => ({
  estimateScale: vi.fn(),
  DEFAULT_CONFIDENCE_THRESHOLD: 0.7,
}));

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



describe('MeasurePage', () => {
  let spy: MockInstance;
  const mockIsWebXRAvailable = isWebXRAvailable as Mock;
  let drawMeasurementLineSpy: MockInstance;
  let drawMeasurementLabelSpy: MockInstance;
  let renderSpy: MockInstance; // Declare renderSpy at a higher scope
  let performanceNowSpy: MockInstance; // Declare performanceNowSpy at a higher scope
  let mockTime: number; // Declare mockTime at a higher scope

  beforeEach(() => {
    // Reset the store and mocks before each test
    useMeasureStore.setState(originalState);
    useMeasureStore.getState().setIsWebXrSupported(true);
    spy = vi.spyOn(measure, 'calculate2dDistance');
    spy.mockReturnValue(1234.5); // e.g., 123.45 cm
    (mockIsWebXRAvailable as Mock).mockResolvedValue(false); // Default mock

    // Add spies for cameraUtils
    vi.spyOn(cameraUtils, 'getCameraStream').mockResolvedValue(mockMediaStream);
    vi.spyOn(cameraUtils, 'stopCameraStream').mockImplementation(() => {});

    // Add ar-overlay div to body for portal
    const arOverlayRoot = document.createElement('div');
    arOverlayRoot.id = 'ar-overlay';
    document.body.appendChild(arOverlayRoot);

    // Spy on drawMeasurement functions
    drawMeasurementLineSpy = vi.spyOn(drawMeasurement, 'drawMeasurementLine');
    drawMeasurementLabelSpy = vi.spyOn(drawMeasurement, 'drawMeasurementLabel');

    // Initialize mocks for FPS test
    renderSpy = vi.spyOn(mockWebGLRendererInstance, 'render');
    performanceNowSpy = vi.spyOn(performance, 'now');
    mockTime = 50; // Reset mockTime for each test
    performanceNowSpy.mockImplementation(() => {
      mockTime += 1000 / 15; // Simulate ~15 FPS (below 24 FPS)
      return mockTime;
    });
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
    const canvas = await screen.findByTestId('measure-canvas-2d', undefined, {
      timeout: 30000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });

    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    const points = useMeasureStore.getState().points;
    const scale = useMeasureStore.getState().scale;
    expect(spy).toHaveBeenCalledWith(points[0], points[1], scale!.mmPerPx);

    expect(
      await screen.findByText('123.5 cm', undefined, { timeout: 30000 })
    ).toBeInTheDocument();
  }, 30000);

  it('should draw measurement line and label in fallback mode after two taps', async () => {
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
    const canvas = await screen.findByTestId('measure-canvas-2d', undefined, {
      timeout: 30000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    await waitFor(() => {
      expect(drawMeasurementLineSpy).toHaveBeenCalledTimes(1);
      expect(drawMeasurementLabelSpy).toHaveBeenCalledTimes(1);
      expect(drawMeasurementLabelSpy).toHaveBeenCalledWith(
        expect.any(CanvasRenderingContext2D),
        '123.5 cm',
        expect.any(Number),
        expect.any(Number)
      );
    }, { timeout: 30000 });
  }, 30000);

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
    const canvas = await screen.findByTestId('measure-canvas-2d', undefined, {
      timeout: 30000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(
      await screen.findByText('123.5 cm', undefined, { timeout: 30000 })
    ).toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(2);

    fireEvent.click(canvas, { clientX: 300, clientY: 300 });

    expect(useMeasureStore.getState().points.length).toBe(1);
    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
  }, 30000);

  it('should display unit selection and default to cm', () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );

    const unitSelect = screen.getByRole('combobox', { name: 'Unit selection / 単位' });
    expect(unitSelect).toBeInTheDocument();
    expect(unitSelect).toHaveValue('cm');

    // Verify options exist within the select
    const options = within(unitSelect).getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('cm');
    expect(options[1]).toHaveTextContent('mm');
    expect(options[2]).toHaveTextContent('inch');
  });

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
    }, { timeout: 30000 });

    // Change unit
    fireEvent.click(screen.getByLabelText('m'));

    // Check for updated text
    await waitFor(() => {
      expect(screen.getByText('1.2 m')).toBeInTheDocument();
      expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
    }, { timeout: 30000 });
  }, 30000);

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
        { timeout: 30000 }
      )
    ).toBeInTheDocument();
  }, 30000);

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
    const canvas = await screen.findByTestId('measure-canvas-2d', undefined, {
      timeout: 30000,
    });

    fireEvent.click(canvas, { clientX: 100, clientY: 100 });
    fireEvent.click(canvas, { clientX: 200, clientY: 200 });

    expect(
      await screen.findByText('123.5 cm', undefined, { timeout: 30000 })
    ).toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(2);

    fireEvent.click(
      await screen.findByRole(
        'button',
        { name: 'リセット' },
        { timeout: 30000 }
      )
    );

    expect(screen.queryByText('123.5 cm')).not.toBeInTheDocument();
    expect(useMeasureStore.getState().points.length).toBe(0);
  }, 30000);

  it('should log FPS to console when AR session is active', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock dependencies for createRenderLoop
    const mockScene = new THREE.Scene();
    const mockCamera = new THREE.PerspectiveCamera();
    const mockRenderer = {
      xr: {
        isPresenting: true,
        getReferenceSpace: vi.fn(() => ({})),
      },
      render: vi.fn(),
      setAnimationLoop: vi.fn(),
    } as unknown as THREE.WebGLRenderer;
    const mockReticleRef = { current: new THREE.Mesh() };
    const mockHitTestSource = {} as XRHitTestSource;
    const mockSetIsPlaneDetected = vi.fn();
    const mockIsTapping = false;
    const mockPoints3d: { x: number; y: number; z: number }[] = [];
    const mockAddPoint3d = vi.fn();
    const mockClearPoints = vi.fn();

    // Mock performance.now to simulate time passing
    mockTime = 0; // Reset mockTime for each test
    performanceNowSpy.mockImplementation(() => {
      mockTime += 1000 / 60; // Simulate ~60 FPS for the test environment
      return mockTime;
    });

    // Create the renderLoop using the utility function
    const renderLoop = createRenderLoop({
      scene: mockScene,
      camera: mockCamera,
      renderer: mockRenderer,
      reticleRef: mockReticleRef,
      hitTestSource: mockHitTestSource,
      setIsPlaneDetected: mockSetIsPlaneDetected,
      isTapping: mockIsTapping,
      points3d: mockPoints3d,
      addPoint3d: mockAddPoint3d,
      clearPoints: mockClearPoints,
      initialFrameCount: 0,
      initialPrevTime: 0, // Pass 0 as initialPrevTime for consistent testing
    });

    // Simulate multiple frames to trigger FPS calculation
    const numFramesToSimulate = 61; // Simulate slightly more than 1 second
    const mockXRFrame = {
      getHitTestResults: vi.fn(() => []), // Mock the method
    } as unknown as XRFrame;
    for (let i = 0; i < numFramesToSimulate; i++) {
      renderLoop(performance.now(), mockXRFrame);
    }

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('FPS:'));

    consoleSpy.mockRestore();
    performanceNowSpy.mockRestore();
  }, 15000);

  it('should throttle rendering to ~24fps when device FPS is high', async () => {
    // Mock dependencies for createRenderLoop
    const mockScene = new THREE.Scene();
    const mockCamera = new THREE.PerspectiveCamera();
    const mockRenderer = {
      xr: {
        isPresenting: true,
        getReferenceSpace: vi.fn(() => ({})),
      },
      render: renderSpy, // Use the spy here
      setAnimationLoop: vi.fn(),
    } as unknown as THREE.WebGLRenderer;
    const mockReticleRef = { current: new THREE.Mesh() };
    const mockHitTestSource = {} as XRHitTestSource;
    const mockSetIsPlaneDetected = vi.fn();
    const mockIsTapping = false;
    const mockPoints3d: { x: number; y: number; z: number }[] = [];
    const mockAddPoint3d = vi.fn();
    const mockClearPoints = vi.fn();

    // Mock performance.now to simulate a high frame rate (~60 FPS)
    mockTime = 0;
    performanceNowSpy.mockImplementation(() => {
      mockTime += 1000 / 60; // Simulate ~60 FPS
      return mockTime;
    });

    const renderLoop = createRenderLoop({
      scene: mockScene,
      camera: mockCamera,
      renderer: mockRenderer,
      reticleRef: mockReticleRef,
      hitTestSource: mockHitTestSource,
      setIsPlaneDetected: mockSetIsPlaneDetected,
      isTapping: mockIsTapping,
      points3d: mockPoints3d,
      addPoint3d: mockAddPoint3d,
      clearPoints: mockClearPoints,
      initialFrameCount: 0,
      initialPrevTime: 0,
    });

    const numFramesToSimulate = 120; // Simulate for 2 seconds
    const mockXRFrame = {
      getHitTestResults: vi.fn(() => []),
    } as unknown as XRFrame;

    for (let i = 0; i < numFramesToSimulate; i++) {
      renderLoop(performance.now(), mockXRFrame);
    }

    // At 60 FPS, we simulate 120 frames over 2 seconds.
    // The rendering is throttled to a maximum of 24 FPS.
    // So, we expect approximately 2 * 24 = 48 render calls.
    const expectedRenders = 40; // 120 frames / (60fps / 24fps) = 40

    expect(renderSpy.mock.calls.length).toBeLessThan(numFramesToSimulate);
    // With the corrected timestamp logic, the number of renders should be very predictable.
    expect(renderSpy.mock.calls.length).toBeCloseTo(expectedRenders, 0);

    renderSpy.mockRestore();
    performanceNowSpy.mockRestore();
  }, 15000);
});

describe('MeasurePage - Scale Estimation Dialog', () => {
  const mockEstimateScale = scaleEstimator.estimateScale as Mock;

  beforeAll(() => {
    // JSDOM doesn't trigger onload for images, so we mock the src setter to do it synchronously.
    Object.defineProperty(global.Image.prototype, 'src', {
      configurable: true,
      set(value) {
        if (value) {
          this.onload?.({} as Event);
        }
      },
    });
  });

  afterAll(() => {
    // Restore the original src setter
    Object.defineProperty(global.Image.prototype, 'src', {
      value: Object.getOwnPropertyDescriptor(global.Image.prototype, 'src'),
    });
  });

  beforeEach(() => {
    mockEstimateScale.mockClear();
    // Ensure OpenCV is ready and reset the store state for each test
    useMeasureStore.setState({ ...originalState, isCvReady: true });
  });

  it('should show confirmation dialog when scale estimation confidence is high', async () => {
    mockEstimateScale.mockReturnValue({
      mmPerPx: 0.1,
      confidence: 0.9,
      matchedReferenceObject: { name: 'A4用紙' },
      matchedDetectedRectangle: { width: 2100, height: 2970 }, // dummy
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );

    const fileInput = screen.getByTestId('hidden-file-input');
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // Use regex to find text that includes the dynamic confidence value
    expect(await screen.findByText(/「A4用紙」を基準にスケールを補正しますか？/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'はい' }));

    await waitFor(() => {
      expect(useMeasureStore.getState().scale?.confidence).toBe(0.9);
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should not show confirmation dialog when scale estimation confidence is low', async () => {
    mockEstimateScale.mockReturnValue({
      mmPerPx: 0,
      confidence: 0.4,
      matchedReferenceObject: null,
      matchedDetectedRectangle: null,
    });

    render(
      <Suspense fallback={<div>Loading...</div>}>
        <MeasurePage />
      </Suspense>
    );

    const fileInput = screen.getByTestId('hidden-file-input');
    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockEstimateScale).toHaveBeenCalled();
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(useMeasureStore.getState().scale).toBe(null);
  });
});