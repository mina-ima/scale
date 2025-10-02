import { render, screen } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  const ProblemChild = () => {
    throw new Error('Test error');
  };

  it('should render fallback UI when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });

  it('should render children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Normal Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal Content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong.')).toBeNull();
  });

  it('should log the error to console', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );
    expect(errorSpy).toHaveBeenCalledWith('Uncaught error:', expect.any(Error), expect.any(Object));
    errorSpy.mockRestore();
  });
});