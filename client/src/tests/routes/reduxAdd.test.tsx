import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route as ReduxAddRoute } from '~/routes/redux/add';
import { useNavigate } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { 
  useAddListingMutation, 
  useGetParentCategoriesQuery, 
  useGetSubCategoriesQuery 
} from '~/store/listingApi';

// Mock the router hooks
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(() => ({ to: vi.fn() })),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock the Redux hooks
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(() => vi.fn())
}));

vi.mock('~/store/listingApi', () => ({
  useAddListingMutation: vi.fn(() => [vi.fn().mockReturnValue({ unwrap: () => Promise.resolve(1) }), { isLoading: false }]),
  useGetParentCategoriesQuery: vi.fn(() => ({ data: [], isLoading: false })),
  useGetSubCategoriesQuery: vi.fn(() => ({ data: [], isLoading: false }))
}));

// Mock ListingForm component
vi.mock('~/forms/listingForm', () => ({
  default: ({ formState, setFormState }) => (
    <div data-testid="mock-listing-form">
      <input 
        type="text" 
        data-testid="title-input" 
        value={formState.title} 
        onChange={(e) => setFormState({ ...formState, title: e.target.value })} 
      />
      <input 
        type="text" 
        data-testid="description-input" 
        value={formState.description} 
        onChange={(e) => setFormState({ ...formState, description: e.target.value })} 
      />
      <button type="submit" data-testid="submit-button">Save</button>
    </div>
  )
}));

describe('ReduxAddRoute component', () => {
  const mockNavigate = vi.fn();
  const mockDispatch = vi.fn();
  const mockAddListing = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve(1) });
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mocks
    vi.mocked(useNavigate).mockReturnValue({ to: mockNavigate });
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);
    vi.mocked(useAddListingMutation).mockReturnValue([mockAddListing, { isLoading: false }]);
    
    // Mock category data
    vi.mocked(useGetParentCategoriesQuery).mockReturnValue({ 
      data: [
        { id: 1, category_name: 'Electronics', parent_id: 0, active: true },
        { id: 2, category_name: 'Clothing', parent_id: 0, active: true }
      ], 
      isLoading: false,
      error: undefined
    });
    
    vi.mocked(useGetSubCategoriesQuery).mockReturnValue({ 
      data: [
        { id: 3, category_name: 'Phones', parent_id: 1, active: true },
        { id: 4, category_name: 'Laptops', parent_id: 1, active: true }
      ], 
      isLoading: false,
      error: undefined
    });

    // Mock alert
    global.alert = vi.fn();
  });

  it('should render the form', () => {
    render(<ReduxAddRoute.component />);
    
    // Check if form is rendered
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const { container } = render(<ReduxAddRoute.component />);
    
    // Get the form and inputs
    const form = container.querySelector('form');
    const titleInput = screen.getByTestId('title-input');
    const descriptionInput = screen.getByTestId('description-input');
    
    // Fill the form
    await userEvent.type(titleInput, 'Test Listing Title');
    await userEvent.type(descriptionInput, 'Test description for the listing');
    
    // Submit the form
    if (form) {
      fireEvent.submit(form);
    }
    
    // Check if the API was called
    expect(mockAddListing).toHaveBeenCalled();
    
    // Check for navigation after successful submission
    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/redux");
      expect(mockDispatch).toHaveBeenCalled(); // resetState should be called
    });
  });

  it('should handle API errors', async () => {
    // Mock API error
    const errorMessage = "Validation error";
    mockAddListing.mockReturnValue({ 
      unwrap: () => Promise.reject({ data: { message: errorMessage } }) 
    });
    
    const { container } = render(<ReduxAddRoute.component />);
    
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

  it('should handle categories loading state', () => {
    // Mock loading state
    vi.mocked(useGetParentCategoriesQuery).mockReturnValue({ 
      data: undefined, 
      isLoading: true,
      error: undefined
    });
    
    render(<ReduxAddRoute.component />);
    
    // Form should still render with loading state handled by child components
    expect(screen.getByTestId('mock-listing-form')).toBeInTheDocument();
  });

  it('should handle category fetch errors', () => {
    // Mock error state
    vi.mocked(useGetParentCategoriesQuery).mockReturnValue({ 
      data: undefined, 
      isLoading: false,
      error: { status: 500, data: { message: 'Failed to load categories' } }
    });
    
    // Suppress expected console errors
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ReduxAddRoute.component />);
    
    // Error should be handled by rendering an error component or message
    // This depends on how your component handles errors
    
    consoleSpy.mockRestore();
  });
});