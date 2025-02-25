import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route as ReduxListingIdRoute } from '~/routes/redux/$listingId';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useDispatch, useSelector } from 'react-redux';
import { 
  useGetListingQuery,
  useUpdateListingMutation,
  useGetParentCategoriesQuery,
  useGetSubCategoriesQuery
} from '~/store/listingApi';
import type { RootState } from '~/store';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(() => ({ to: vi.fn() })),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock React Redux
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
  useDispatch: vi.fn(() => vi.fn())
}));

// Mock RTK Query hooks
vi.mock('~/store/listingApi', () => ({
  useGetListingQuery: vi.fn(),
  useUpdateListingMutation: vi.fn(() => [vi.fn(), { isLoading: false }]),
  useGetParentCategoriesQuery: vi.fn(),
  useGetSubCategoriesQuery: vi.fn()
}));

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

describe('ReduxListingIdRoute component', () => {
  const mockNavigate = vi.fn();
  const mockUpdateListing = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve(1) });
  const mockListingId = '42';
  
  const mockListing = {
    id: 42,
    title: 'Test Redux Listing',
    subTitle: 'A test listing',
    categoryId: 1,
    subCategoryId: 2,
    endDate: '2023-12-31',
    description: 'This is a test listing',
    condition: true,
    listingPrice: '100.00',
    reservePrice: '80.00',
    creditCardPayment: true,
    bankTransferPayment: false,
    bitcoinPayment: false,
    pickUp: true,
    shippingOption: 'post'
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mocks
    vi.mocked(useParams).mockReturnValue({ listingId: mockListingId });
    vi.mocked(useNavigate).mockReturnValue({ to: mockNavigate });
    vi.mocked(useDispatch).mockReturnValue(vi.fn());
    
    // Mock Redux selector
    vi.mocked(useSelector).mockImplementation((selector) => {
      return selector({ listing: mockListing } as RootState);
    });
    
    // Mock RTK Query hooks
    vi.mocked(useGetListingQuery).mockReturnValue({
      data: mockListing,
      isLoading: false,
      error: undefined,
      refetch: vi.fn()
    } as any);
    
    vi.mocked(useUpdateListingMutation).mockReturnValue([
      mockUpdateListing,
      { isLoading: false }
    ] as any);
    
    vi.mocked(useGetParentCategoriesQuery).mockReturnValue({
      data: [
        { id: 1, category_name: 'Electronics', parent_id: 0, active: true },
        { id: 2, category_name: 'Clothing', parent_id: 0, active: true }
      ],
      isLoading: false,
      error: undefined
    } as any);
    
    vi.mocked(useGetSubCategoriesQuery).mockReturnValue({
      data: [
        { id: 3, category_name: 'Phones', parent_id: 1, active: true },
        { id: 4, category_name: 'Laptops', parent_id: 1, active: true }
      ],
      isLoading: false,
      error: undefined
    } as any);
  });

  it('should render the form with listing data', () => {
    render(<ReduxListingIdRoute.component />);
    
    // Form should be displayed with listing data
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
    
    // Title input should have the current listing title
    const titleInput = screen.getByTestId('title-input');
    expect(titleInput).toHaveValue('Test Redux Listing');
  });

  it('should handle form submission and update the listing', async () => {
    const { container } = render(<ReduxListingIdRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the update function was called with the listing ID
    expect(mockUpdateListing).toHaveBeenCalled();
    
    // Should navigate back to listings page after successful update
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/redux');
    });
  });

  it('should handle loading state', () => {
    // Mock loading state for the listing query
    vi.mocked(useGetListingQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      refetch: vi.fn()
    } as any);
    
    render(<ReduxListingIdRoute.component />);
    
    // Should show the loader
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should handle errors when loading listing', () => {
    // Mock error state for the listing query
    vi.mocked(useGetListingQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 404, data: { message: 'Listing not found' } },
      refetch: vi.fn()
    } as any);
    
    render(<ReduxListingIdRoute.component />);
    
    // Should show the error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });
});