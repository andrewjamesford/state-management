import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Route as TsqueryAddRoute } from '~/routes/tsquery/add';
import { useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '~/api';

// Mock TanStack Router
vi.mock('@tanstack/react-router', () => ({
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
    getCategories: vi.fn(),
    addListing: vi.fn()
  }
}));

// Mock React hooks
vi.mock('react', () => {
  const originalReact = vi.importActual('react');
  return {
    ...originalReact,
    useState: vi.fn()
  };
});

// Mock ListingForm component
vi.mock('~/forms/listingForm', () => ({
  default: ({ formState, setFormState }) => (
    <div data-testid="mock-listing-form">
      <input 
        data-testid="title-input" 
        value={formState.title || ''} 
        onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))} 
      />
      <input 
        data-testid="description-input"
        value={formState.description || ''} 
        onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))} 
      />
      <button type="submit" data-testid="submit-button">Save</button>
    </div>
  )
}));

describe('TsqueryAddRoute component', () => {
  const mockNavigate = vi.fn();
  const mockSetFormState = vi.fn();
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn();
  
  // Mock form state
  const mockFormState = {
    id: 0,
    title: 'Test Listing',
    subTitle: '',
    categoryId: 1,
    subCategoryId: 2,
    endDate: new Date('2023-12-31'),
    description: 'Test description',
    condition: false,
    listingPrice: 100,
    reservePrice: 50,
    creditCardPayment: true,
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
    
    // Mock useQuery hooks
    vi.mocked(useQuery).mockImplementation((options: any) => {
      if (options.queryKey[0] === 'parentCategories') {
        return {
          data: [
            { id: 1, category_name: 'Electronics', parent_id: 0, active: true },
            { id: 2, category_name: 'Clothing', parent_id: 0, active: true }
          ],
          isLoading: false,
          error: null
        };
      } else if (options.queryKey[0] === 'subCategories') {
        return {
          data: [
            { id: 3, category_name: 'Phones', parent_id: 1, active: true },
            { id: 4, category_name: 'Laptops', parent_id: 1, active: true }
          ],
          isLoading: false,
          error: null
        };
      }
      return { data: undefined, isLoading: false, error: null };
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
    
    // Mock API responses
    vi.mocked(api.getCategories).mockResolvedValue({
      ok: true,
      json: async () => ([])
    } as any);
  });

  it('should render the form', () => {
    render(<TsqueryAddRoute.component />);
    
    // Check if form is rendered
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should handle form submission', () => {
    const { container } = render(<TsqueryAddRoute.component />);
    
    // Get the form
    const form = container.querySelector('form');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the mutation was called with correct data
    expect(mockMutate).toHaveBeenCalledWith(
      { listing: expect.objectContaining({ title: 'Test Listing' }) }
    );
  });
  
  it('should handle loading states for categories', () => {
    // Mock loading state for categories
    vi.mocked(useQuery).mockImplementationOnce((options: any) => ({
      data: undefined,
      isLoading: true,
      error: null
    }));
    
    render(<TsqueryAddRoute.component />);
    
    // Component should handle loading state gracefully
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
  });

  it('should handle errors in category fetch', () => {
    // Mock error state for categories
    vi.mocked(useQuery).mockImplementationOnce((options: any) => ({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch categories')
    }));
    
    render(<TsqueryAddRoute.component />);
    
    // Component should handle error state gracefully
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
  });
});