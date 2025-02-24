import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from '~/components/loader';

describe('Loader', () => {
  it('renders with default dimensions', () => {
    render(<Loader />);
    const svg = screen.getByRole('img', { name: /loading animation/i });
    expect(svg).toHaveAttribute('width', '10');
    expect(svg).toHaveAttribute('height', '10');
  });

  it('accepts custom dimensions', () => {
    render(<Loader width={20} height={30} />);
    const svg = screen.getByRole('img', { name: /loading animation/i });
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '30');
  });

  it('includes loading title for accessibility', () => {
    render(<Loader />);
    expect(screen.getByTitle('Loading')).toBeInTheDocument();
  });

  it('has animation class', () => {
    render(<Loader />);
    const svg = screen.getByRole('img', { name: /loading animation/i });
    expect(svg).toHaveClass('animate-spin');
  });
});