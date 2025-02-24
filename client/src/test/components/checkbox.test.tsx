import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '~/components/checkbox';

describe('Checkbox', () => {
  it('renders checkbox with label', () => {
    render(
      <Checkbox
        id="test-checkbox"
        label="Test Checkbox"
      />
    );

    expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('handles checked state', () => {
    render(
      <Checkbox
        id="test-checkbox"
        label="Test Checkbox"
        checked={true}
      />
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('handles user interaction', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Checkbox
        id="test-checkbox"
        label="Test Checkbox"
        onChange={onChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(onChange).toHaveBeenCalled();
  });

  it('applies custom label class', () => {
    render(
      <Checkbox
        id="test-checkbox"
        label="Test Checkbox"
        labelClassName="custom-label"
      />
    );

    expect(screen.getByText('Test Checkbox')).toHaveClass('custom-label');
  });
});