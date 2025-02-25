import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { listingApi } from '~/store/listingApi';
import listingReducer, { setListing } from '~/store/listingSlice';
import type { RootState } from '~/store';

// Mock fetch to avoid actual API calls
vi.stubGlobal('fetch', vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
));

describe('Redux Store Configuration', () => {
  let store: ReturnType<typeof setupStore>;
  
  // Helper to create store with the same configuration as the app
  function setupStore() {
    return configureStore({
      reducer: {
        listing: listingReducer,
        [listingApi.reducerPath]: listingApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(listingApi.middleware),
    });
  }
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create a fresh store for each test
    store = setupStore();
  });
  
  describe('Store configuration', () => {
    it('should have the correct initial state', () => {
      const state = store.getState();
      
      expect(state.listing).toBeDefined();
      expect(state.listing.id).toBe(0);
      expect(state.listing.title).toBe('');
      expect(state[listingApi.reducerPath]).toBeDefined();
      expect(state[listingApi.reducerPath].queries).toBeDefined();
    });
    
    it('should handle listing reducer actions', () => {
      store.dispatch(setListing({ title: 'Test Redux Store', listingPrice: '100.00' }));
      
      const state = store.getState();
      expect(state.listing.title).toBe('Test Redux Store');
      expect(state.listing.listingPrice).toBe('100.00');
    });
  });
  
  describe('RTK Query middleware', () => {
    beforeEach(() => {
      // Mock fetch for API calls
      vi.mocked(fetch).mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { 
              id: 1, 
              title: 'Test Listing',
              subtitle: 'Test subtitle',
              categoryid: 1,
              subcategoryid: 2,
              enddate: '2023-12-31',
              listingdescription: 'Test description',
              condition: true,
              listingprice: '100.00',
              reserveprice: '80.00',
              creditcardpayment: true,
              banktransferpayment: false,
              bitcoinpayment: false,
              pickup: true,
              shippingoption: 'post'
            }
          ])
        } as Response)
      );
    });
    
    it('should dispatch API requests and handle responses', async () => {
      // Dispatch an API request
      const result = await store.dispatch(listingApi.endpoints.getListings.initiate());
      
      // Verify that fetch was called with correct URL
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/listings'), 
        expect.anything()
      );
      
      // Check if the data was transformed correctly
      expect(result.data).toBeDefined();
      if (result.data) {
        expect(result.data.length).toBe(1);
        expect(result.data[0].title).toBe('Test Listing');
        expect(result.data[0].listingPrice).toBe('100.00');
      }
      
      // Verify query state is in the store
      const state = store.getState();
      expect(Object.keys(state[listingApi.reducerPath].queries)).toHaveLength(1);
    });
    
    it('should cache query results', async () => {
      // First request should fetch from API
      await store.dispatch(listingApi.endpoints.getListings.initiate());
      
      // Reset fetch mock to track second call
      vi.mocked(fetch).mockClear();
      
      // Second request should use cached data
      await store.dispatch(listingApi.endpoints.getListings.initiate());
      
      // Fetch should not be called again for the same request
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});