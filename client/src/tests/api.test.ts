import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from '~/api';
import type { Listing } from '~/models';

describe('API module', () => {
  const originalFetch = global.fetch;
  const mockApiUrl = 'http://test-api.example';
  
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn();
    
    // Mock VITE_API_URL environment variable
    vi.stubEnv('VITE_API_URL', mockApiUrl);
  });
  
  afterEach(() => {
    // Restore fetch
    global.fetch = originalFetch;
    
    // Clear all mocks
    vi.clearAllMocks();
  });
  
  describe('getCategories', () => {
    it('should fetch categories with default parent ID of 0', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      
      // Act
      await api.getCategories();
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories?parentId=0`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        })
      );
    });
    
    it('should fetch categories with specified parent ID', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      const parentId = 5;
      
      // Act
      await api.getCategories(parentId);
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/categories?parentId=${parentId}`,
        expect.anything()
      );
    });
  });
  
  describe('getListings', () => {
    it('should fetch all listings with correct URL and headers', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      
      // Act
      await api.getListings();
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/listings`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          })
        })
      );
    });
  });
  
  describe('getListing', () => {
    it('should fetch a single listing by ID', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      const listingId = '42';
      
      // Act
      await api.getListing(listingId);
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/listings/${listingId}`,
        expect.anything()
      );
    });
  });
  
  describe('addListing', () => {
    it('should send POST request with listing data', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      const testListing: Listing = {
        id: 0,
        title: 'Test Listing',
        subTitle: 'A test listing',
        categoryId: 1,
        subCategoryId: 2,
        description: 'This is a test listing description',
        endDate: '2023-12-31',
        condition: true,
        listingPrice: '100.00',
        reservePrice: '80.00',
        creditCardPayment: true,
        bankTransferPayment: false,
        bitcoinPayment: false,
        pickUp: true,
        shippingOption: 'post'
      };
      
      // Act
      await api.addListing(testListing);
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/listings`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify(testListing)
        })
      );
    });
  });
  
  describe('updateListing', () => {
    it('should send PUT request with updated listing data', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      const listingId = '15';
      const updatedListing: Listing = {
        id: 15,
        title: 'Updated Listing',
        subTitle: 'An updated test listing',
        categoryId: 3,
        subCategoryId: 4,
        description: 'This listing has been updated',
        endDate: '2024-01-15',
        condition: false,
        listingPrice: '150.00',
        reservePrice: '120.00',
        creditCardPayment: true,
        bankTransferPayment: true,
        bitcoinPayment: false,
        pickUp: false,
        shippingOption: 'courier'
      };
      
      // Act
      await api.updateListing(listingId, updatedListing);
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/listings/${listingId}`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.anything(),
          body: JSON.stringify(updatedListing)
        })
      );
    });
  });
  
  describe('getDraftListing', () => {
    it('should fetch draft listing for a specific user', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      const userId = 'user123';
      
      // Act
      await api.getDraftListing(userId);
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/listings/${userId}`,
        expect.anything()
      );
    });
  });
  
  describe('saveDraftListing', () => {
    it('should send POST request with draft listing data', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({} as Response);
      const userId = 'user456';
      const draftListing: Listing = {
        id: 0,
        title: 'Draft Listing',
        subTitle: 'A draft listing',
        categoryId: 5,
        subCategoryId: 6,
        description: 'This is a draft listing',
        endDate: '2024-02-15',
        condition: true,
        listingPrice: '200.00',
        reservePrice: '180.00',
        creditCardPayment: true,
        bankTransferPayment: false,
        bitcoinPayment: true,
        pickUp: true,
        shippingOption: 'post'
      };
      
      // Act
      await api.saveDraftListing(userId, draftListing);
      
      // Assert
      expect(fetch).toHaveBeenCalledWith(
        `${mockApiUrl}/listings/${userId}`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.anything(),
          body: JSON.stringify(draftListing)
        })
      );
    });
  });
});