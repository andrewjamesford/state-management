import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route as ZustandListingIdRoute } from '~/routes/zustand/$listingId';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useListingStore } from '~/store/listingStore';
import { format } from 'date-fns';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(() => ({ to: vi.fn() })),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock Zustand store
vi.mock('~/store/listingStore', () => ({
  useListingStore: vi.fn()
}));

// Mock React hooks
vi.mock('react', () => {
  const originalReact = vi.importActual('react');
  return {
    ...originalReact,
    useState: vi.fn(),
    useEffect: vi.fn((callback, deps) => callback())
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
        onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))} 
      />
      <button type="submit" data-testid="submit-button">Save</button>
    </div>
  )
}));

// Mock error and loading components
vi.mock('~/components/errorMessage', () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  )
}));

vi.mock('~/components/loader', () => ({
  default: () => <div data-testid="loader">Loading...</div>
}));

describe('ZustandListingIdRoute component', () => {
  const mockNavigate = vi.fn();
  const mockFetchListing = vi.fn();
  const mockFetchCategories = vi.fn();
  const mockFetchSubCategories = vi.fn();
  const mockUpdateListing = vi.fn();
  const mockSetFormState = vi.fn();
  const mockListingId = '42';
  
  const tomorrow = format(new Date(Date.now() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
  
  const mockListing = {
    id: 42,
    title: 'Test Zustand Listing',
    subTitle: 'A test listing with Zustand',
    categoryId: 1,
    subCategoryId: 2,
    endDate: '2023-12-31',
    description: 'This is a test listing using Zustand',
    condition: true,
    listingPrice: '150.00',
    reservePrice: '120.00',
    creditCardPayment: true,
    bankTransferPayment: true,
    bitcoinPayment: false,
    pickUp: true,
    shippingOption: 'courier'
  };
  
  const mockFormState = {
    id: 42,
    title: 'Test Zustand Listing',
    subTitle: 'A test listing with Zustand',
    categoryId: 1,
    subCategoryId: 2,
    endDate: new Date('2023-12-31'),
    description: 'This is a test listing using Zustand',
    condition: true,
    listingPrice: 150,
    reservePrice: 120,
    creditCardPayment: true,
    bankTransferPayment: true,
    bitcoinPayment: false,
    pickUp: true,
    shippingOption: 'courier'
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mocks
    vi.mocked(useParams).mockReturnValue({ listingId: mockListingId });
    vi.mocked(useNavigate).mockReturnValue({ to: mockNavigate });
    vi.mocked(React.useState).mockReturnValue([mockFormState, mockSetFormState]);
    
    // Mock Zustand store
    vi.mocked(useListingStore).mockReturnValue({
      listing: mockListing,
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
      fetchListing: mockFetchListing,
      fetchCategories: mockFetchCategories,
      fetchSubCategories: mockFetchSubCategories,
      updateListing: mockUpdateListing
    } as any);
  });

  it('should render the form with listing data', () => {
    render(<ZustandListingIdRoute.component />);
    
    // Form should be displayed with listing data
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toHaveValue('Test Zustand Listing');
  });

  it('should fetch listing data on mount', () => {
    render(<ZustandListingIdRoute.component />);
    
    // Should fetch listing and categories on mount
    expect(mockFetchListing).toHaveBeenCalledWith(mockListingId);
    expect(mockFetchCategories).toHaveBeenCalled();
  });

  it('should handle form submission and update the listing', async () => {
    mockUpdateListing.mockResolvedValue({ id: mockListingId });
    
    const { container } = render(<ZustandListingIdRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the update function was called with the right parameters
    expect(mockUpdateListing).toHaveBeenCalledWith(mockListingId, expect.anything());
    
    // Should navigate back to listings page after successful update
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/zustand');
    });
  });

  it('should handle API errors during update', async () => {
    // Mock error during update
    const errorMessage = 'Failed to update listing';
    mockUpdateListing.mockRejectedValue(new Error(errorMessage));
    
    // Mock window.alert
    global.alert = vi.fn();
    
    const { container } = render(<ZustandListingIdRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if alert was shown with error message
    await vi.waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
    
    // Navigation should not happen on error
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should handle loading state', () => {
    // Mock loading state
    vi.mocked(useListingStore).mockReturnValue({
      listing: null,
      categories: [],
      subCategories: [],
      isLoading: true,
      error: null,
      fetchListing: mockFetchListing,
      fetchCategories: mockFetchCategories,
      fetchSubCategories: mockFetchSubCategories
    } as any);
    
    render(<ZustandListingIdRoute.component />);
    
    // Should show the loader
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should handle errors when loading listing', () => {
    // Mock error state
    vi.mocked(useListingStore).mockReturnValue({
      listing: null,
      categories: [],
      subCategories: [],
      isLoading: false,
      error: 'Failed to load listing',
      fetchListing: mockFetchListing,
      fetchCategories: mockFetchCategories,
      fetchSubCategories: mockFetchSubCategories
    } as any);
    
    render(<ZustandListingIdRoute.component />);
    
    // Should show the error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Failed to load listing')).toBeInTheDocument();
  });

  it('should update form state when listing data changes', () => {
    // Setup mock for useEffect to control when it runs
    let effectCallback;
    vi.mocked(React.useEffect).mockImplementation((callback, deps) => {
      if (deps && deps.length > 0 && deps.includes(mockListing)) {
        effectCallback = callback;
      }
      return () => {};
    });
    
    render(<ZustandListingIdRoute.component />);
    
    // Manually trigger the effect that updates form state when listing changes
    if (effectCallback) effectCallback();
    
    // Form state should be updated with listing data
    expect(mockSetFormState).toHaveBeenCalled();
  });

  it('should fetch subcategories when category changes', () => {
    // Setup mock for useEffect to control when it runs
    let effectCallback;
    vi.mocked(React.useEffect).mockImplementation((callback, deps) => {
      if (deps && deps.length > 0 && deps.includes(mockFormState.categoryId)) {
        effectCallback = callback;
      }
      return () => {};
    });
    
    render(<ZustandListingIdRoute.component />);
    
    // Manually trigger the effect that fetches subcategories when category changes
    if (effectCallback) effectCallback();
    
    // Subcategories should be fetched for the current category
    expect(mockFetchSubCategories).toHaveBeenCalledWith(mockFormState.categoryId);
  });
});