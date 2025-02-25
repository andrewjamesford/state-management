import { describe, it, expect, vi, afterAll } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { ErrorBoundary } from 'react-error-boundary';
import React from 'react';

// Component that simulates an error
const ErrorComponent = ({ shouldError = true }: { shouldError?: boolean }) => {
  if (shouldError) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Mock error fallback component
const FallbackComponent = ({ error }: { error: Error }) => {
  return <div data-testid="error-fallback">{error.message}</div>;
};

describe('Error handling', () => {
  // Console errors are expected in these tests; we don't want them to pollute the test output
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  
  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });
  
  it('should catch errors with ErrorBoundary', async () => {
    const handleError = vi.fn();
    
    const { getByTestId } = render(
      <ErrorBoundary
        FallbackComponent={FallbackComponent}
        onError={handleError}
      >
        <ErrorComponent />
      </ErrorBoundary>
    );
    
    // Error should be caught and fallback rendered
    await waitFor(() => {
      expect(getByTestId('error-fallback')).toBeInTheDocument();
      expect(getByTestId('error-fallback').textContent).toBe('Test error');
    });
    
    // Error handler should be called
    expect(handleError).toHaveBeenCalled();
  });
  
  it('should recover from errors when reset', async () => {
    const handleReset = vi.fn();
    
    // Create a custom fallback that includes a reset button
    const ResettableFallback = ({ 
      error, 
      resetErrorBoundary 
    }: { 
      error: Error; 
      resetErrorBoundary: () => void;
    }) => {
      return (
        <div>
          <div data-testid="error-message">{error.message}</div>
          <button 
            type="button"
            data-testid="reset-button" 
            onClick={() => {
              handleReset();
              resetErrorBoundary();
            }}
          >
            Reset
          </button>
        </div>
      );
    };
    
    // Create a component with state to control the error condition
    function TestErrorRecovery() {
      const [shouldError, setShouldError] = React.useState(true);
      
      return (
        <ErrorBoundary
          FallbackComponent={ResettableFallback}
          onReset={() => setShouldError(false)}
        >
          <ErrorComponent shouldError={shouldError} />
        </ErrorBoundary>
      );
    }
    
    const { getByTestId } = render(<TestErrorRecovery />);
    
    // Confirm the error is displayed
    await waitFor(() => {
      expect(getByTestId('error-message')).toBeInTheDocument();
      expect(getByTestId('error-message').textContent).toBe('Test error');
    });
    
    // Click the reset button
    getByTestId('reset-button').click();
    
    // Handler should be called and UI should be reset
    expect(handleReset).toHaveBeenCalled();
    await waitFor(() => {
      expect(document.body.textContent).toBe('No error');
    });
  });
});