import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Route as ZustandIndexRoute } from '~/routes/zustand/index';
import { useListingStore } from '~/store/listingStore';
import type { Listing } from '~/models';

// Mock the router hooks and components
vi.mock('@tanstack/react-router', () => ({
  useNavigate: vi.fn(() => () => {}),
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock the components used by the route
vi.mock('~/components/listingTile', () => ({
  default: ({ listing, basePath }: { listing: Listing, basePath: string }) => (
    <div data-testid="listing-tile">
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
    </div>
  )
}));

vi.mock('~/components/errorMessage', () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  )
}));

vi.mock('~/components/loader', () => ({
  default: ({ width, height }: { width?: number, height?: number }) => (
    <div data-testid="loader" data-width={width} data-height={height}>
      Loading...
    </div>
  )
}));

// Mock the Zustand store
vi.mock('~/store/listingStore', () => ({
  useListingStore: vi.fn()
}));

describe('ZustandIndexRoute component', () => {
  const mockListings: Listing[] = [
    {
      id: 1,
      title: "Zustand Test Listing 1",
      subTitle: "First test listing",
      categoryId: 1,
      subCategoryId: 2,
      endDate: "2023-12-01",
      description: "Description for first listing",
      listingPrice: "100.00",
      reservePrice: "80.00",
      creditCardPayment: true,
      bankTransferPayment: false,
      bitcoinPayment: false,
      pickUp: true,
      shippingOption: "post",
      condition: true
    },
    {
      id: 2,
      title: "Zustand Test Listing 2",
      subTitle: "Second test listing",
      categoryId: 3,
      subCategoryId: 4,
      endDate: "2023-12-15",
      description: "Description for second listing",
      listingPrice: "200.00",
      reservePrice: "150.00",
      creditCardPayment: false,
      bankTransferPayment: true,
      bitcoinPayment: false,
      pickUp: false,
      shippingOption: "courier",
      condition: false
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup the mock implementation of useEffect
    vi.spyOn(React, 'useEffect').mockImplementation(f => f());
  });

  it('should render listings when data is loaded successfully', () => {
    // Mock the Zustand store
    vi.mocked(useListingStore).mockReturnValue({
      listings: mockListings,
      isLoading: false,
      error: null,
      fetchListings: vi.fn()
    } as any);

    render(<ZustandIndexRoute.component />);

    // Should show the add listing button
    expect(screen.getByText('Add Listing')).toBeInTheDocument();
    
    // Should render the correct number of listing tiles
    const listingTiles = screen.getAllByTestId('listing-tile');
    expect(listingTiles).toHaveLength(2);
    
    // Should display the listing titles
    expect(screen.getByText('Zustand Test Listing 1')).toBeInTheDocument();
    expect(screen.getByText('Zustand Test Listing 2')).toBeInTheDocument();
    
    // Should call fetchListings on mount
    expect(useListingStore().fetchListings).toHaveBeenCalled();
  });

  it('should render loading state when data is being fetched', () => {
    // Mock the Zustand store
    vi.mocked(useListingStore).mockReturnValue({
      listings: [],
      isLoading: true,
      error: null,
      fetchListings: vi.fn()
    } as any);

    render(<ZustandIndexRoute.component />);

    // Should show loader
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should render error message when fetch fails', () => {
    // Mock the Zustand store
    vi.mocked(useListingStore).mockReturnValue({
      listings: [],
      isLoading: false,
      error: 'Failed to load listings',
      fetchListings: vi.fn()
    } as any);

    render(<ZustandIndexRoute.component />);

    // Should show error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Failed to load listings')).toBeInTheDocument();
  });

  it('should render empty state when no listings available', () => {
    // Mock the Zustand store
    vi.mocked(useListingStore).mockReturnValue({
      listings: [],
      isLoading: false,
      error: null,
      fetchListings: vi.fn()
    } as any);

    render(<ZustandIndexRoute.component />);

    // Should not show any listing tiles
    expect(screen.queryAllByTestId('listing-tile')).toHaveLength(0);
  });
});