import { format } from "date-fns";
import { create } from "zustand";
import api from "~/api";
import type { Category, Listing, listingDefault } from "~/models";

interface ListingStore {
	listing: Listing;
	listings: Listing[];
	categories: Category[];
	subCategories: Category[];
	isLoading: boolean;
	error: string | null;
	setListing: (listing: Listing) => void;
	fetchListing: (id: number) => Promise<void>;
	fetchListings: () => Promise<void>;
	fetchCategories: () => Promise<void>;
	fetchSubCategories: (categoryId: number) => Promise<void>;
	updateListing: (id: number, listing: Partial<Listing>) => Promise<void>;
	addListing: (listing: Partial<Listing>) => Promise<void>;
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
	listingPrice: 0,
	reservePrice: 0,
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
	// Will replace the store object rather than a shallow merge when updating/adding
	replace: true,

	setListing: (listing) => set({ listing }),

	fetchListing: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.getListing(id);
			if (!response) throw new Error("Failed to fetch listing");
			const data = response;
			if (!data) throw new Error("No data found");

			set({ listing: data, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			});
		}
	},

	fetchListings: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.getListings();
			if (!response) throw new Error("Failed to fetch listings");
			const data = response;
			if (!data) throw new Error("No data found");
			set({ listings: data, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			});
		}
	},

	fetchCategories: async () => {
		try {
			const response = await api.getCategories();
			if (!response) throw new Error("Failed to fetch categories");
			const data = response;
			if (!data) throw new Error("No data found");
			set({ categories: data });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
			});
		}
	},

	fetchSubCategories: async (categoryId) => {
		try {
			const response = await api.getCategories(categoryId);
			if (!response) throw new Error("Failed to fetch subcategories");
			const data: Category[] = response;
			if (!data) throw new Error("No data found");
			set({ subCategories: data });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
			});
		}
	},

	updateListing: async (id, listing) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.updateListing(id, listing);
			if (!response) throw new Error("Failed to update listing");
			const data = response;
			if (!data) throw new Error("No data found");
			set({ listing: data, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			});
			throw error;
		}
	},

	addListing: async (listing) => {
		set({ isLoading: true, error: null });
		try {
			const response = await api.addListing(listing);
			if (!response) throw new Error("Failed to add listing");
			const data = response;
			if (!data) throw new Error("No data found");
			set({ listing: data, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			});
			throw error;
		}
	},
}));
