import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GrowthMeasurementTabContent from './GrowthMeasurementTabContent';
import { useMeasureStore } from '../store/measureStore';
import * as fallbackUtils from '../core/fallback/utils';
import * as measureUtils from '../core/measure/calculate2dDistance';

const mockGenerateFileName = vi.fn();

// Mock the modules that are not relevant to the component's logic
vi.mock('../core/fallback/utils');
vi.mock('../core/measure/calculate2dDistance');

describe('GrowthMeasurementTabContent', () => {
  const originalState = useMeasureStore.getState();

  beforeEach(() => {
    // Reset the store to its initial state before each test
    act(() => {
      useMeasureStore.setState(originalState, true);
    });

    // Mock implementations
    vi.mocked(fallbackUtils.getTapCoordinates).mockReturnValue({ x: 10, y: 10 });
    vi.mocked(measureUtils.calculate2dDistance).mockReturnValue(100);

    // Mock HTMLVideoElement.prototype.play
    HTMLVideoElement.prototype.play = vi.fn();

    // Mock MediaDevices.getUserMedia
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn(() =>
          Promise.resolve({
            getTracks: () => [{ stop: vi.fn() }, { stop: vi.fn() }],
          } as unknown as MediaStream)
        ),
      },
      writable: true,
    });

    // Mock navigator.xr
    Object.defineProperty(navigator, 'xr', {
      value: {
        isSessionSupported: vi.fn(() => Promise.resolve(false)),
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('calculates and sets measurement after two taps', async () => {
    const addPointSpy = vi.spyOn(useMeasureStore.getState(), 'addPoint');
    const setMeasurementSpy = vi.spyOn(useMeasureStore.getState(), 'setMeasurement');

    act(() => {
      useMeasureStore.setState({ 
        points: [{ x: 0, y: 0 }],
        scale: { mmPerPx: 1, confidence: 1, matchedReferenceObject: null, matchedDetectedRectangle: null },
      });
    });

    render(
      <GrowthMeasurementTabContent
        mode="shinchou"
        generateFileName={mockGenerateFileName}
      />
    );

    const canvas = screen.getByTestId('growth-record-canvas-shinchou');
    fireEvent.click(canvas, { clientX: 10, clientY: 10 }); // Simulate second tap

    expect(addPointSpy).toHaveBeenCalledTimes(1);
    expect(measureUtils.calculate2dDistance).toHaveBeenCalledWith(
      { x: 0, y: 0 },
      { x: 10, y: 10 }
    );
    expect(setMeasurementSpy).toHaveBeenCalledWith({
      valueMm: 100,
      valueCm: 10,
      dateISO: expect.any(String),
    });
  });

  it('clears points and adds new one on third tap', async () => {
    const clearPointsSpy = vi.spyOn(useMeasureStore.getState(), 'clearPoints');
    const addPointSpy = vi.spyOn(useMeasureStore.getState(), 'addPoint');
    const setMeasurementSpy = vi.spyOn(useMeasureStore.getState(), 'setMeasurement');

    act(() => {
      useMeasureStore.setState({
        points: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
        measurement: {
          valueMm: 100,
          valueCm: 10,
          dateISO: '2023-01-01',
        },
      });
    });

    render(
      <GrowthMeasurementTabContent
        mode="shinchou"
      />
    );

    // calculate2dDistance is called once when the second point is added (before this test's act block)
    expect(measureUtils.calculate2dDistance).toHaveBeenCalledTimes(1);
    vi.clearAllMocks(); // Clear previous calls to focus on the third tap's effect

    const canvas = screen.getByTestId('growth-record-canvas-shinchou');
    fireEvent.click(canvas, { clientX: 20, clientY: 20 }); // Simulate third tap

    expect(clearPointsSpy).toHaveBeenCalledTimes(1);
    expect(addPointSpy).toHaveBeenCalledTimes(1);
    expect(addPointSpy).toHaveBeenCalledWith({ x: 20, y: 20 });
    expect(measureUtils.calculate2dDistance).not.toHaveBeenCalled(); // Should not be called again after clearing and adding one point
    expect(setMeasurementSpy).not.toHaveBeenCalled(); // setMeasurement is called by useEffect when points.length is 2, but not after clearPoints or addPoint(1)
  });
});
