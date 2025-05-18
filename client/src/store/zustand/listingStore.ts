import { create } from "zustand";
import api from "~/api";
import type { Category, Listing } from "~/models";
import { listingDefault } from "~/models";
import { format } from "date-fns";

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
	updateListing: (id: number, listing: Listing) => Promise<void>;
	addListing: (listing: Listing) => Promise<void>;
}

export const useListingStore = create<ListingStore>((set) => ({
	listing: listingDefault,
	listings: [],
	categories: [],
	subCategories: [],
	isLoading: false,
	error: null,

	setListing: (listing) => set({ listing }),

	fetchListing: async (id: number) => {
		set({ isLoading: true, error: null });
		try {
			const result = await api.getListing(id);
			if (!result) throw new Error("Failed to fetch listing");
			set({ listing: result, isLoading: false });
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
			const result = await api.getListings();
			if (!result) throw new Error("Failed to fetch listings");
			set({ listings: result, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			});
		}
	},

	fetchCategories: async () => {
		try {
			const result = await api.getCategories();
			if (!result) throw new Error("Failed to fetch categories");
			set({ categories: result });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
			});
		}
	},

	fetchSubCategories: async (categoryId) => {
		try {
			const result = await api.getCategories(categoryId);
			if (!result) throw new Error("Failed to fetch subcategories");
			set({ subCategories: result });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
			});
		}
	},

	updateListing: async (id, listing) => {
		set({ isLoading: true, error: null });
		try {
			// Format dates and numbers as strings for API
			const formattedListing = {
				...listing,
				endDate:
					listing.endDate instanceof Date
						? format(listing.endDate, "yyyy-MM-dd")
						: listing.endDate,
				listingPrice:
					typeof listing.listingPrice === "number"
						? listing.listingPrice.toString()
						: listing.listingPrice,
				reservePrice:
					typeof listing.reservePrice === "number"
						? listing.reservePrice.toString()
						: listing.reservePrice,
			};

			const result = await api.updateListing(id, formattedListing);
			if (!result) throw new Error("Failed to update listing");
			set({ listing: result, isLoading: false });
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
			// Format dates and numbers as strings for API
			const formattedListing = {
				...listing,
				endDate:
					listing.endDate instanceof Date
						? format(listing.endDate, "yyyy-MM-dd")
						: listing.endDate,
				listingPrice:
					typeof listing.listingPrice === "number"
						? listing.listingPrice.toString()
						: listing.listingPrice,
				reservePrice:
					typeof listing.reservePrice === "number"
						? listing.reservePrice.toString()
						: listing.reservePrice,
			};

			const result = await api.addListing(formattedListing);
			if (!result) throw new Error("Failed to add listing");
			set({ listing: result, isLoading: false });
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "An error occurred",
				isLoading: false,
			});
			throw error;
		}
	},
}));
