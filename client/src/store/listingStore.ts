import { create } from 'zustand';
import { format } from 'date-fns';
import type { Listing, ListingSchema, Category } from '~/models';
import api from '~/api';

interface ListingStore {
  listing: Listing;
  listings: Listing[];
  categories: Category[];
  subCategories: Category[];
  isLoading: boolean;
  error: string | null;
  setListing: (listing: Listing) => void;
  fetchListing: (id: string) => Promise<void>;
  fetchListings: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchSubCategories: (categoryId: number) => Promise<void>;
  updateListing: (id: string, listing: Partial<ListingSchema>) => Promise<void>;
  addListing: (listing: Partial<ListingSchema>) => Promise<void>;
}

const initialListing: Listing = {
  id: 0,
  title: "",
  subTitle: "",
  categoryId: 0,
  subCategoryId: 0,
  endDate: new Date(),
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

export const useListingStore = create<ListingStore>((set) => ({
  listing: initialListing,
  listings: [],
  categories: [],
  subCategories: [],
  isLoading: false,
  error: null,

  setListing: (listing) => set({ listing }),

  fetchListing: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getListing(id);
      if (!response.ok) throw new Error('Failed to fetch listing');
      const data = await response.json();
      set({ listing: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  fetchListings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.getListings();
      if (!response.ok) throw new Error('Failed to fetch listings');
      const data = await response.json();
      set({ listings: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await api.getCategories();
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      set({ categories: data });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  },

  fetchSubCategories: async (categoryId) => {
    try {
      const response = await api.getCategories();
      if (!response.ok) throw new Error('Failed to fetch subcategories');
      const data: Category[] = await response.json();
      const subCategories = data.filter((cat) => cat.parent_id === categoryId);
      set({ subCategories });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
  },

  updateListing: async (id, listing) => {
    set({ isLoading: true, error: null });
    try {
      const listingToUpdate = {
        ...listing,
        endDate: listing.endDate ? format(listing.endDate, 'yyyy-MM-dd') : '',
        listingPrice: String(listing.listingPrice),
        reservePrice: String(listing.reservePrice)
      };
      const response = await api.updateListing(id, listingToUpdate as Listing);
      if (!response.ok) throw new Error('Failed to update listing');
      const data = await response.json();
      set({ listing: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
      throw error;
    }
  },

  addListing: async (listing) => {
    set({ isLoading: true, error: null });
    try {
      const listingToAdd = {
        ...listing,
        endDate: listing.endDate ? format(listing.endDate, 'yyyy-MM-dd') : '',
        listingPrice: String(listing.listingPrice),
        reservePrice: String(listing.reservePrice)
      };
      const response = await api.addListing(listingToAdd as Listing);
      if (!response.ok) throw new Error('Failed to add listing');
      const data = await response.json();
      set({ listing: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false });
      throw error;
    }
  },
}));