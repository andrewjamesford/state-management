import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route as TsqueryListingIdRoute } from '~/routes/tsquery/$listingId';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '~/api';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(() => ({ to: vi.fn() })),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn()
  }))
}));

// Mock API
vi.mock('~/api', () => ({
  default: {
    getListing: vi.fn(),
    getCategories: vi.fn(),
    updateListing: vi.fn()
  }
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

describe('TsqueryListingIdRoute component', () => {
  const mockNavigate = vi.fn();
  const mockListingId = '42';
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockSetFormState = vi.fn();
  
  const mockListing = {
    id: 42,
    title: 'Test TanStack Query Listing',
    subtitle: 'A test listing with TanStack Query',
    categoryid: 1,
    subcategoryid: 2,
    enddate: '2023-12-31',
    listingdescription: 'This is a test listing using TanStack Query',
    condition: true,
    listingprice: '200.00',
    reserveprice: '150.00',
    creditcardpayment: true,
    banktransferpayment: false,
    bitcoinpayment: true,
    pickup: true,
    shippingoption: 'post'
  };
  
  const mockFormState = {
    id: 42,
    title: 'Test TanStack Query Listing',
    subTitle: 'A test listing with TanStack Query',
    categoryId: 1,
    subCategoryId: 2,
    endDate: new Date('2023-12-31'),
    description: 'This is a test listing using TanStack Query',
    condition: true,
    listingPrice: 200,
    reservePrice: 150,
    creditCardPayment: true,
    bankTransferPayment: false,
    bitcoinPayment: true,
    pickUp: true,
    shippingOption: 'post'
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mocks
    vi.mocked(useParams).mockReturnValue({ listingId: mockListingId });
    vi.mocked(useNavigate).mockReturnValue({ to: mockNavigate });
    vi.mocked(React.useState).mockReturnValue([mockFormState, mockSetFormState]);
    
    // Mock useQuery hooks
    vi.mocked(useQuery).mockImplementation((options: any) => {
      if (options.queryKey && options.queryKey[0] === 'listing') {
        return {
          data: mockListing,
          isLoading: false,
          error: undefined
        };
      } else if (options.queryKey && options.queryKey[0] === 'parentCategories') {
        return {
          data: [
            { id: 1, category_name: 'Electronics', parent_id: 0, active: true },
            { id: 2, category_name: 'Clothing', parent_id: 0, active: true }
          ],
          isLoading: false,
          error: undefined
        };
      } else if (options.queryKey && options.queryKey[0] === 'subCategories') {
        return {
          data: [
            { id: 3, category_name: 'Phones', parent_id: 1, active: true },
            { id: 4, category_name: 'Laptops', parent_id: 1, active: true }
          ],
          isLoading: false,
          error: undefined
        };
      }
      return { data: undefined, isLoading: false, error: undefined };
    });
    
    // Mock useMutation hook
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null
    } as any);
    
    // Mock useQueryClient
    vi.mocked(useQueryClient).mockReturnValue({
      invalidateQueries: mockInvalidateQueries
    } as any);
  });

  it('should render the form with listing data', () => {
    render(<TsqueryListingIdRoute.component />);
    
    // Form should be displayed with listing data
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
    expect(screen.getByTestId('title-input')).toHaveValue('Test TanStack Query Listing');
  });

  it('should handle form submission and update the listing', () => {
    const { container } = render(<TsqueryListingIdRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the mutation was called with the right parameters
    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({ 
        id: mockListingId,
        listing: expect.objectContaining({ 
          title: 'Test TanStack Query Listing'
        })
      })
    );
  });

  it('should handle loading state for listing data', () => {
    // Mock loading state for listing query
    vi.mocked(useQuery).mockImplementationOnce((options: any) => ({
      data: undefined,
      isLoading: true,
      error: undefined
    }));
    
    render(<TsqueryListingIdRoute.component />);
    
    // Should show the loader
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should handle errors when loading listing', () => {
    // Mock error state for listing query
    vi.mocked(useQuery).mockImplementationOnce((options: any) => ({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to load listing')
    }));
    
    render(<TsqueryListingIdRoute.component />);
    
    // Should show the error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should handle error when loading categories', () => {
    // Override the mock to return error for categories query
    vi.mocked(useQuery).mockImplementation((options: any) => {
      if (options.queryKey && options.queryKey[0] === 'listing') {
        return {
          data: mockListing,
          isLoading: false,
          error: undefined
        };
      } else if (options.queryKey && options.queryKey[0] === 'parentCategories') {
        return {
          data: undefined,
          isLoading: false,
          error: new Error('Failed to load categories')
        };
      }
      return { data: undefined, isLoading: false, error: undefined };
    });
    
    // The component should handle errors gracefully
    render(<TsqueryListingIdRoute.component />);
    
    // Form should still be displayed even if category loading fails
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
  });

  it('should update form state when listing data is received', () => {
    // Reset the useState mock to test the initial form state setup
    vi.mocked(React.useState).mockReset();
    vi.mocked(React.useState).mockImplementationOnce((initialState) => {
      // Verify that initialState contains data from the listing
      expect(initialState).toHaveProperty('title');
      expect(initialState).toHaveProperty('categoryId');
      return [mockFormState, mockSetFormState];
    });
    
    render(<TsqueryListingIdRoute.component />);
  });
});