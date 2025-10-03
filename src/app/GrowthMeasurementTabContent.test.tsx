import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GrowthMeasurementTabContent from './GrowthMeasurementTabContent';
import { useMeasureStore, MeasureState } from '../store/measureStore';
import * as fallbackUtils from '../core/fallback/utils';
import * as measureUtils from '../core/measure/calculate2dDistance';

const mockGenerateFileName = vi.fn();

const mockAddPoint = vi.fn();
const mockClearPoints = vi.fn();
const mockSetMeasurement = vi.fn();
const mockSetUnit = vi.fn();

let mockMeasureStoreValue: MeasureState = {
  points: [],
  measurement: null,
  scale: { source: 'none', mmPerPx: 1, confidence: 1 }, // Mock a default scale
  unit: 'cm',
  addPoint: mockAddPoint,
  clearPoints: mockClearPoints,
  setMeasurement: mockSetMeasurement,
  setUnit: mockSetUnit,
  measureMode: 'growth-height',
  error: null,
  points3d: [],
  setMeasureMode: vi.fn(),
  setScale: vi.fn(),
  setError: vi.fn(),
  addPoint3d: vi.fn(),
};

// Mock the zustand store
vi.mock('../store/measureStore', () => ({
  useMeasureStore: vi.fn((selector) => selector(mockMeasureStoreValue)),
}));

vi.mock('../core/fallback/utils');
vi.mock('../core/measure/calculate2dDistance');

describe('GrowthMeasurementTabContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockMeasureStoreValue = {
      points: [],
      measurement: null,
      scale: { source: 'none', mmPerPx: 1, confidence: 1 }, // Mock a default scale
      unit: 'cm',
      addPoint: mockAddPoint,
      clearPoints: mockClearPoints,
      setMeasurement: mockSetMeasurement,
      setUnit: mockSetUnit,
      measureMode: 'growth-height',
      error: null,
      points3d: [],
      setMeasureMode: vi.fn(),
      setScale: vi.fn(),
      setError: vi.fn(),
      addPoint3d: vi.fn(),
    };

    vi.mocked(useMeasureStore).mockReturnValue(mockMeasureStoreValue);

    vi.mocked(fallbackUtils.getTapCoordinates).mockReturnValue({
      x: 10,
      y: 10,
    });
    vi.mocked(measureUtils.calculate2dDistance).mockReturnValue(100);

    // Mock HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      // Mock other context methods as needed
    })) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

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

  it('calculates and sets measurement after two taps', () => {
    mockMeasureStoreValue.points = [{ x: 0, y: 0 }]; // First point already added

    render(
      <GrowthMeasurementTabContent
        mode="shinchou"
        generateFileName={mockGenerateFileName}
      />
    );

    const canvas = screen.getByTestId('growth-record-canvas-shinchou');
    fireEvent.click(canvas); // Simulate second tap

    expect(mockAddPoint).toHaveBeenCalledTimes(1); // First tap adds a point
    expect(mockClearPoints).not.toHaveBeenCalled(); // Should not clear yet
    expect(measureUtils.calculate2dDistance).toHaveBeenCalledWith(
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      1 // Expecting mmPerPx, not the full scale object
    );
    expect(mockSetMeasurement).toHaveBeenCalledWith({
      mode: 'growth-shinchou',
      valueMm: 100,
      unit: 'cm',
      dateISO: expect.any(String),
    });
  });

  it('clears points and adds new one on third tap', () => {
    mockMeasureStoreValue.points = [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
    ]; // Two points already added
    mockMeasureStoreValue.measurement = {
      mode: 'growth-height',
      valueMm: 100,
      unit: 'cm',
      dateISO: '2023-01-01',
    }; // Add mode

    render(
      <GrowthMeasurementTabContent
        mode="shinchou"
        generateFileName={mockGenerateFileName}
      />
    );

    const canvas = screen.getByTestId('growth-record-canvas-shinchou');
    fireEvent.click(canvas); // Simulate third tap

    expect(mockClearPoints).toHaveBeenCalledTimes(1);
    expect(mockAddPoint).toHaveBeenCalledTimes(1);
    expect(mockAddPoint).toHaveBeenCalledWith({ x: 10, y: 10 });
    expect(measureUtils.calculate2dDistance).not.toHaveBeenCalled(); // Should not calculate on third tap
    expect(mockSetMeasurement).not.toHaveBeenCalled(); // Should not set measurement on third tap
  });
});
