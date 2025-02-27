import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { listingApi } from '~/store/listingApi';
import listingReducer, { setListing } from '~/store/listingSlice';

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
  
  
});
