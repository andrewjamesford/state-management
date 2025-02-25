import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route as ZustandAddRoute } from '~/routes/zustand/add';
import { useNavigate } from '@tanstack/react-router';
import { useListingStore } from '~/store/listingStore';

// Mock the router hooks
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(() => ({ to: vi.fn() })),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock the Zustand store
vi.mock('~/store/listingStore', () => ({
  useListingStore: vi.fn()
}));

// Mock the React hooks
vi.mock('react', () => {
  const originalReact = vi.importActual('react');
  return {
    ...originalReact,
    useState: vi.fn(),
    useEffect: vi.fn((fn) => fn())
  };
});

// Mock ListingForm component
vi.mock('~/forms/listingForm', () => ({
  default: ({ formState, setFormState }) => (
    <div data-testid="mock-listing-form">
      <input 
        type="text" 
        data-testid="title-input" 
        value={formState.title || ''} 
        onChange={(e) => setFormState({ ...formState, title: e.target.value })} 
      />
      <input 
        type="text" 
        data-testid="description-input" 
        value={formState.description || ''} 
        onChange={(e) => setFormState({ ...formState, description: e.target.value })} 
      />
      <button type="submit" data-testid="submit-button">Save</button>
    </div>
  )
}));

describe('ZustandAddRoute component', () => {
  const mockNavigate = vi.fn();
  const mockAddListing = vi.fn();
  const mockFetchCategories = vi.fn();
  const mockFetchSubCategories = vi.fn();
  const mockSetFormState = vi.fn();
  
  // Mock form state
  const mockFormState = {
    id: 0,
    title: '',
    subTitle: '',
    categoryId: 0,
    subCategoryId: 0,
    endDate: new Date(),
    description: '',
    condition: false,
    listingPrice: 0,
    reservePrice: 0,
    creditCardPayment: false,
    bankTransferPayment: false,
    bitcoinPayment: false,
    pickUp: true,
    shippingOption: "post"
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mocks
    vi.mocked(useNavigate).mockReturnValue({ to: mockNavigate });
    vi.mocked(React.useState).mockReturnValue([mockFormState, mockSetFormState]);
    
    // Mock Zustand store
    vi.mocked(useListingStore).mockReturnValue({
      categories: [
        { id: 1, category_name: 'Electronics', parent_id: 0, active: true },
        { id: 2, category_name: 'Clothing', parent_id: 0, active: true }
      ],
      subCategories: [
        { id: 3, category_name: 'Phones', parent_id: 1, active: true },
        { id: 4, category_name: 'Laptops', parent_id: 1, active: true }
      ],
      isLoading: false,
      error: null,
      fetchCategories: mockFetchCategories,
      fetchSubCategories: mockFetchSubCategories,
      addListing: mockAddListing
    } as any);
  });

  it('should render the form', () => {
    render(<ZustandAddRoute.component />);
    
    // Check if form is rendered
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should fetch categories on mount', () => {
    render(<ZustandAddRoute.component />);
    
    // Check if categories were fetched
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  it('should handle form submission', async () => {
    mockAddListing.mockResolvedValue({ id: 1 });
    
    const { container } = render(<ZustandAddRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the API was called
    expect(mockAddListing).toHaveBeenCalledWith(mockFormState);
    
    // Check for navigation after successful submission
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/zustand");
    });
  });

  it('should handle API errors', async () => {
    // Mock API error
    const errorMessage = "Failed to add listing";
    mockAddListing.mockRejectedValue(new Error(errorMessage));
    
    // Mock window.alert
    global.alert = vi.fn();
    
    const { container } = render(<ZustandAddRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the API was called
    expect(mockAddListing).toHaveBeenCalled();
    
    // Check if alert was shown with error message
    await vi.waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
    
    // Navigation should not happen on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should fetch subcategories when category changes', () => {
    // Mock useEffect to control when it runs
    let effectCallback;
    vi.mocked(React.useEffect).mockImplementation((callback, deps) => {
      if (deps && deps.length === 2 && deps[0] === mockFormState.categoryId) {
        effectCallback = callback;
      }
      return () => {};
    });
    
    render(<ZustandAddRoute.component />);
    
    // Update category ID in form state
    const updatedFormState = { ...mockFormState, categoryId: 1 };
    vi.mocked(React.useState).mockReturnValueOnce([updatedFormState, mockSetFormState]);
    
    // Manually call the effect that watches categoryId
    if (effectCallback) effectCallback();
    
    // Check if subcategories were fetched for the updated category
    expect(mockFetchSubCategories).toHaveBeenCalledWith(1);
  });
});