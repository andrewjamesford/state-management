import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LinkComponent } from '~/components/linkComponent';

// Mock the router Link component
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className, activeProps }: any) => (
    <a href={to} className={className} data-active-props={JSON.stringify(activeProps)}>
      {children}
    </a>
  ),
}));

describe('LinkComponent', () => {
  it('renders link with default styles', () => {
    render(
      <LinkComponent
        to="/test"
        title="Test Link"
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveTextContent('Test Link');
    expect(link).toHaveClass('text-sm', 'text-gray-600', 'underline');
  });

  it('applies custom classes when provided', () => {
    const customClass = 'custom-link-class';
    render(
      <LinkComponent
        to="/test"
        title="Test Link"
        classes={customClass}
      />
    );

    expect(screen.getByRole('link')).toHaveClass(customClass);
  });

  it('sets correct href', () => {
    render(
      <LinkComponent
        to="/test-path"
        title="Test Link"
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', '/test-path');
  });

  it('includes activeProps for styling active state', () => {
    render(
      <LinkComponent
        to="/test"
        title="Test Link"
      />
    );

    const link = screen.getByRole('link');
    const activeProps = JSON.parse(link.getAttribute('data-active-props') || '{}');
    expect(activeProps.className).toBe('font-bold');
  });
});