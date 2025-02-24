import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '~/components/footer';

describe('Footer', () => {
  it('renders demo badge', () => {
    render(<Footer />);
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('displays the application description', () => {
    render(<Footer />);
    expect(screen.getByText(/This application is a demonstration/)).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('px-4', 'py-2', 'bg-gray-100');
  });
});