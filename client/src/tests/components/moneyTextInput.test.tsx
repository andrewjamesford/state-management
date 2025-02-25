import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MoneyTextInput from '~/components/moneyTextInput';

describe('MoneyTextInput', () => {
  it('renders with label and dollar sign', () => {
    render(
      <MoneyTextInput
        id="price-input"
        label="Price"
      />
    );

    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByLabelText('Price')).toBeInTheDocument();
  });

  it('accepts valid currency input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MoneyTextInput
        id="price-input"
        label="Price"
        onChange={onChange}
      />
    );

    const input = screen.getByRole('textbox');
    await user.type(input, '123.45');

    expect(input).toHaveValue('123.45');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message when provided', () => {
    render(
      <MoneyTextInput
        id="price-input"
        label="Price"
        errorMessage="Invalid amount"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid amount');
  });

  it('validates decimal places with pattern attribute', () => {
    render(
      <MoneyTextInput
        id="price-input"
        label="Price"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('pattern', '^\\d+(\\.\\d{0,2})?$');
  });

  it('applies custom classes', () => {
    render(
      <MoneyTextInput
        id="price-input"
        label="Price"
        labelClassName="custom-label"
        errorClassName="custom-error"
      />
    );

    const label = screen.getByText('Price');
    expect(label).toHaveClass('custom-label');
  });
});