import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Route as ReduxIndexRoute } from '~/routes/redux/index';
import { useGetListingsQuery } from '~/store/listingApi';
import type { Listing } from '~/models';

// Mock the router hooks
vi.mock('@tanstack/react-router', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn(() => () => {}),
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock the Redux hooks
vi.mock('~/store/listingApi', () => ({
  useGetListingsQuery: vi.fn()
}));

// Mock the components used by the route
vi.mock('~/components/listingTile', () => ({
  default: ({ listing, basePath }: { listing: Listing, basePath: string }) => (
    <div data-testid="listing-tile">
      <h2>{listing.title}</h2>
      <p>{listing.description}</p>
      <span>Path: {basePath}</span>
    </div>
  )
}));

vi.mock('~/components/errorMessage', () => ({
  default: ({ message }: { message: string }) => (
    <div data-testid="error-message">{message}</div>
  )
}));

vi.mock('~/components/skeleton', () => ({
  default: ({ layoutType, repeat }: { layoutType?: string, repeat?: number }) => (
    <div data-testid="skeleton" data-layout={layoutType} data-repeat={repeat}>
      Loading...
    </div>
  )
}));

describe('ReduxIndexRoute component', () => {
  const mockListings: Listing[] = [
    {
      id: 1,
      title: "Test Listing 1",
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
      title: "Test Listing 2",
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
  });

  it('should render listings when data is loaded successfully', () => {
    // Mock the API hook to return successful data
    vi.mocked(useGetListingsQuery).mockReturnValue({
      data: mockListings,
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
      isFetching: false
    } as any);

    render(<ReduxIndexRoute.component />);

    // Should show the add listing button
    expect(screen.getByText('Add Listing')).toBeInTheDocument();
    
    // Should render the correct number of listing tiles
    const listingTiles = screen.getAllByTestId('listing-tile');
    expect(listingTiles).toHaveLength(2);
    
    // Should display the listing titles
    expect(screen.getByText('Test Listing 1')).toBeInTheDocument();
    expect(screen.getByText('Test Listing 2')).toBeInTheDocument();
  });

  it('should render loading state when data is being fetched', () => {
    // Mock the API hook to return loading state
    vi.mocked(useGetListingsQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: undefined,
      refetch: vi.fn(),
      isFetching: true
    } as any);

    render(<ReduxIndexRoute.component />);

    // Should show skeleton loader
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render error message when fetch fails', () => {
    // Mock the API hook to return error state
    vi.mocked(useGetListingsQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 500, data: { message: 'Failed to fetch listings' } },
      refetch: vi.fn(),
      isFetching: false
    } as any);

    render(<ReduxIndexRoute.component />);

    // Should show error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch listings')).toBeInTheDocument();
  });

  it('should render empty state when no listings available', () => {
    // Mock the API hook to return empty array
    vi.mocked(useGetListingsQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: undefined,
      refetch: vi.fn(),
      isFetching: false
    } as any);

    render(<ReduxIndexRoute.component />);

    // Should not show any listing tiles
    expect(screen.queryAllByTestId('listing-tile')).toHaveLength(0);
  });
});