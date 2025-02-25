import { describe, it, expect } from 'vitest';
import ErrorMessage from '~/components/errorMessage';
import { render, screen } from '@testing-library/react';

// Testing error handling components and utilities
describe('Error handling', () => {
  describe('ErrorMessage component', () => {
    it('displays custom error message', () => {
      render(<ErrorMessage message="Custom error occurred" />);
      expect(screen.getByText('Custom error occurred')).toBeInTheDocument();
    });
    
    it('displays default error message when none provided', () => {
      render(<ErrorMessage />);
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
    
    it('includes proper accessibility attributes', () => {
      render(<ErrorMessage message="Test error" />);
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass('text-red-700');
    });
  });
});