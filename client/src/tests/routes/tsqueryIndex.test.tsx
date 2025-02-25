import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Route as TsqueryIndexRoute } from '~/routes/tsquery/index';
import { useQuery } from '@tanstack/react-query';
import type { Listing, RawListing } from '~/models';

// Mock the router components
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>{children}</a>
  ),
  createFileRoute: () => ({ component: (Component: any) => Component })
}));

// Mock the TanStack Query hooks
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

// Mock the API module
vi.mock('~/api', () => ({
  default: {
    getListings: vi.fn()
  }
}));

// Mock the components used by the route
vi.mock('~/components/listingTile', () => ({
  default: ({ listing, basePath }: { listing: Listing, basePath: string }) => (
    <div data-testid="listing-tile">
      <h2>{listing.title}</h2>
      <p>{listing.subTitle}</p>
      <span>${listing.listingPrice}</span>
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

describe('TsqueryIndexRoute component', () => {
  const mockRawListings: RawListing[] = [
    {
      id: 1,
      title: "TanStack Query Listing 1",
      subtitle: "First TanStack Query listing",
      categoryid: 1,
      subcategoryid: 2,
      enddate: "2023-12-20",
      listingdescription: "Description for first listing",
      listingprice: "150.00",
      reserveprice: "120.00",
      creditcardpayment: true,
      banktransferpayment: false,
      bitcoinpayment: false,
      pickup: true,
      shippingoption: "post",
      condition: true,
      category: "Electronics"
    },
    {
      id: 2,
      title: "TanStack Query Listing 2",
      subtitle: "Second TanStack Query listing",
      categoryid: 3,
      subcategoryid: 4,
      enddate: "2023-12-25",
      listingdescription: "Description for second listing",
      listingprice: "250.00",
      reserveprice: "200.00",
      creditcardpayment: false,
      banktransferpayment: true,
      bitcoinpayment: true,
      pickup: false,
      shippingoption: "courier",
      condition: false,
      category: "Clothing"
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render listings when data is loaded successfully', () => {
    // Mock the useQuery hook to return successful data
    vi.mocked(useQuery).mockReturnValue({
      data: mockRawListings.map(raw => ({
        id: raw.id,
        title: raw.title,
        subTitle: raw.subtitle,
        categoryId: raw.categoryid,
        subCategoryId: raw.subcategoryid,
        endDate: raw.enddate,
        description: raw.listingdescription,
        listingPrice: raw.listingprice,
        reservePrice: raw.reserveprice,
        creditCardPayment: raw.creditcardpayment,
        bankTransferPayment: raw.banktransferpayment,
        bitcoinPayment: raw.bitcoinpayment,
        pickUp: raw.pickup,
        shippingOption: raw.shippingoption,
        condition: raw.condition,
      })),
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);

    render(<TsqueryIndexRoute.component />);

    // Should show the add listing button
    expect(screen.getByText('Add Listing')).toBeInTheDocument();
    
    // Should render the correct number of listing tiles
    const listingTiles = screen.getAllByTestId('listing-tile');
    expect(listingTiles).toHaveLength(2);
    
    // Should display the listing titles
    expect(screen.getByText('TanStack Query Listing 1')).toBeInTheDocument();
    expect(screen.getByText('TanStack Query Listing 2')).toBeInTheDocument();
  });

  it('should render loading state when data is being fetched', () => {
    // Mock the useQuery hook to return loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn()
    } as any);

    render(<TsqueryIndexRoute.component />);

    // Should show skeleton loader
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('should render error message when fetch fails', () => {
    // Mock the useQuery hook to return error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch listings'),
      refetch: vi.fn()
    } as any);

    render(<TsqueryIndexRoute.component />);

    // Should show error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('should render empty state when no listings available', () => {
    // Mock the useQuery hook to return empty array
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    } as any);

    render(<TsqueryIndexRoute.component />);

    // Should not show any listing tiles, only the Add Listing button
    expect(screen.queryAllByTestId('listing-tile')).toHaveLength(0);
    expect(screen.getByText('Add Listing')).toBeInTheDocument();
  });
});