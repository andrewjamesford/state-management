import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textarea from '~/components/textarea';

describe('Textarea', () => {
  it('renders with label', () => {
    render(
      <Textarea
        id="test-textarea"
        label="Description"
      />
    );

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Textarea
        id="test-textarea"
        label="Description"
        onChange={onChange}
      />
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Test description');

    expect(onChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('Test description');
  });

  it('shows error message when provided', () => {
    render(
      <Textarea
        id="test-textarea"
        label="Description"
        errorMessage="Required field"
        errorClassName="error-text"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Required field');
    expect(screen.getByRole('alert')).toHaveClass('error-text');
  });

  it('applies custom classes', () => {
    render(
      <Textarea
        id="test-textarea"
        label="Description"
        labelClassName="custom-label"
      />
    );

    expect(screen.getByText('Description')).toHaveClass('custom-label');
  });

  it('forwards additional props to textarea element', () => {
    render(
      <Textarea
        id="test-textarea"
        label="Description"
        maxLength={500}
        placeholder="Enter description"
        required
      />
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('maxLength', '500');
    expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    expect(textarea).toBeRequired();
  });
});