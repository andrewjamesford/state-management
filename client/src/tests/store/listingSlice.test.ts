import { describe, it, expect } from 'vitest';
import reducer, { setListing, resetState } from '~/store/listingSlice';
import type { Listing } from '~/models';

describe('listingSlice', () => {
  const initialState: Listing = {
    id: 0,
    title: "",
    subTitle: "",
    categoryId: 0,
    subCategoryId: 0,
    endDate: "",
    condition: false,
    description: "",
    listingPrice: "0",
    reservePrice: "0",
    creditCardPayment: false,
    bankTransferPayment: false,
    bitcoinPayment: false,
    pickUp: false,
    shippingOption: "",
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('setListing action', () => {
    it('should update listing details when setListing is called', () => {
      const listingUpdate: Partial<Listing> = {
        id: 1,
        title: "Test Listing",
        description: "A test description",
        listingPrice: "100.00"
      };
      
      const newState = reducer(initialState, setListing(listingUpdate));
      
      expect(newState).toEqual({
        ...initialState,
        ...listingUpdate
      });
    });
    
    it('should handle updating multiple properties', () => {
      const state: Listing = {
        ...initialState,
        id: 5,
        title: "Original title"
      };
      
      const update: Partial<Listing> = {
        title: "Updated title",
        categoryId: 10,
        condition: true
      };
      
      const newState = reducer(state, setListing(update));
      
      expect(newState).toEqual({
        ...state,
        ...update
      });
    });
  });

  describe('resetState action', () => {
    it('should reset state to initial values', () => {
      const modifiedState: Listing = {
        ...initialState,
        id: 42,
        title: "Modified Title",
        categoryId: 7,
        listingPrice: "150.00",
        creditCardPayment: true
      };
      
      const newState = reducer(modifiedState, resetState());
      
      expect(newState).toEqual(initialState);
    });
  });
});