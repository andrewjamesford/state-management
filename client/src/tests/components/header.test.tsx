import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '~/components/header';
import * as localStorage from '~/utils/localStorage';

// Mock the localStorage utils
vi.mock('~/utils/localStorage', () => ({
  getLocalStorageItem: vi.fn(),
  setLocalStorageItem: vi.fn()
}));

// Mock the menu components directly instead of using React.lazy
vi.mock('~/components/menuLoggedIn', () => ({
  default: ({ onChange }: { onChange: () => void }) => (
    <div>
      <span>Tanstack Query</span>
      <span>Redux</span>
      <span>Zustand</span>
      <button onClick={onChange}>Log out</button>
    </div>
  )
}));

vi.mock('~/components/menuLoggedOut', () => ({
  default: ({ onChange }: { onChange: () => void }) => (
    <button onClick={onChange}>Log In</button>
  )
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders logo and title', () => {
    vi.mocked(localStorage.getLocalStorageItem).mockReturnValue(false);
    render(<Header />);
    
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByText('SOLD!')).toBeInTheDocument();
  });

  it('shows logged out menu by default', () => {
    vi.mocked(localStorage.getLocalStorageItem).mockReturnValue(false);
    render(<Header />);
    
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('shows logged in menu when user is logged in', () => {
    vi.mocked(localStorage.getLocalStorageItem).mockReturnValue(true);
    render(<Header />);
    
    expect(screen.getByText('Log out')).toBeInTheDocument();
    expect(screen.getByText('Tanstack Query')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
    expect(screen.getByText('Zustand')).toBeInTheDocument();
  });

  it('handles login/logout actions', async () => {
    const user = userEvent.setup();
    vi.mocked(localStorage.getLocalStorageItem).mockReturnValue(false);
    
    const { rerender } = render(<Header />);
    
    // Test login
    await user.click(screen.getByText('Log In'));
    expect(localStorage.setLocalStorageItem).toHaveBeenCalledWith('isLoggedIn', true);

    // Mock logged in state and rerender
    vi.mocked(localStorage.getLocalStorageItem).mockReturnValue(true);
    rerender(<Header />);
    
    // Test logout
    await user.click(screen.getByText('Log out'));
    expect(localStorage.setLocalStorageItem).toHaveBeenCalledWith('isLoggedIn', false);
  });
});