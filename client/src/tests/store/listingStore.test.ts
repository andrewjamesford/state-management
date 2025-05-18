import { format } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "~/api";
import type { ApiListing, Category, Listing } from "~/models";
import { useListingStore } from "~/store/zustand/listingStore";

// Mock the API module
vi.mock("~/api", () => ({
	default: {
		getListing: vi.fn(),
		getListings: vi.fn(),
		getCategories: vi.fn(),
		addListing: vi.fn(),
		updateListing: vi.fn(),
	},
}));

describe("listingStore (Zustand)", () => {
	beforeEach(() => {
		// Reset the API mocks
		vi.resetAllMocks();

		// Reset the store state
		useListingStore.setState({
			listing: {
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
			},
			listings: [],
			categories: [],
			subCategories: [],
			isLoading: false,
			error: null,
		});
	});

	describe("setListing", () => {
		it("should update the listing state", () => {
			const testListing: Listing = {
				id: 1,
				title: "Test Listing",
				subTitle: "Test Subtitle",
				categoryId: 2,
				subCategoryId: 3,
				endDate: new Date("2023-12-31"),
				condition: true,
				description: "Test description",
				listingPrice: 100,
				reservePrice: 50,
				creditCardPayment: true,
				bankTransferPayment: false,
				bitcoinPayment: false,
				pickUp: true,
				shippingOption: "post",
			};

			const { setListing } = useListingStore.getState();
			setListing(testListing);

			const updatedState = useListingStore.getState();
			expect(updatedState.listing).toEqual(testListing);
		});
	});

	describe("fetchListing", () => {
		it("should fetch and update listing data", async () => {
			// Mock API response
			const mockApiListing: ApiListing = {
				id: 5,
				title: "API Listing",
				subTitle: "From API",
				categoryId: 2,
				subCategoryId: 4,
				endDate: "2023-10-15",
				condition: true,
				description: "Description from API",
				listingPrice: "75.00",
				reservePrice: "25.00",
				creditCardPayment: true,
				bankTransferPayment: true,
				bitcoinPayment: false,
				pickUp: false,
				shippingOption: "courier",
				category: "API Category",
			};

			vi.mocked(api.getListing).mockResolvedValue({
				id: mockApiListing.id,
				title: mockApiListing.title,
				subTitle: mockApiListing.subTitle,
				categoryId: mockApiListing.categoryId,
				subCategoryId: mockApiListing.subCategoryId,
				endDate: new Date("2023-10-15"),
				condition: mockApiListing.condition,
				description: mockApiListing.description,
				listingPrice: 75,
				reservePrice: 25,
				creditCardPayment: mockApiListing.creditCardPayment,
				bankTransferPayment: mockApiListing.bankTransferPayment,
				bitcoinPayment: mockApiListing.bitcoinPayment,
				pickUp: mockApiListing.pickUp,
				shippingOption: mockApiListing.shippingOption,
			});

			const { fetchListing } = useListingStore.getState();
			await fetchListing(5);

			const state = useListingStore.getState();

			// Verify loading state changed
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();

			// Verify the data was transformed and stored correctly
			expect(state.listing).toEqual({
				id: mockApiListing.id,
				title: mockApiListing.title,
				subTitle: mockApiListing.subTitle,
				categoryId: mockApiListing.categoryId,
				subCategoryId: mockApiListing.subCategoryId,
				endDate: new Date("2023-10-15"),
				condition: mockApiListing.condition,
				description: mockApiListing.description,
				listingPrice: 75,
				reservePrice: 25,
				creditCardPayment: mockApiListing.creditCardPayment,
				bankTransferPayment: mockApiListing.bankTransferPayment,
				bitcoinPayment: mockApiListing.bitcoinPayment,
				pickUp: mockApiListing.pickUp,
				shippingOption: mockApiListing.shippingOption,
			});
		});

		it("should handle API errors", async () => {
			// Mock API error response
			vi.mocked(api.getListing).mockRejectedValue(
				new Error("Failed to fetch listing"),
			);

			const { fetchListing } = useListingStore.getState();
			await fetchListing(999);

			const state = useListingStore.getState();

			expect(state.isLoading).toBe(false);
			expect(state.error).toBe("Failed to fetch listing");
		});
	});

	describe("fetchListings", () => {
		it("should fetch and update multiple listings", async () => {
			const mockApiListings: ApiListing[] = [
				{
					id: 1,
					title: "First Listing",
					subTitle: "First subtitle",
					categoryId: 1,
					subCategoryId: 2,
					endDate: "2023-11-30",
					condition: false,
					description: "First description",
					listingPrice: "10.00",
					reservePrice: "5.00",
					creditCardPayment: true,
					bankTransferPayment: false,
					bitcoinPayment: false,
					pickUp: true,
					shippingOption: "post",
					category: "Category One",
				},
				{
					id: 2,
					title: "Second Listing",
					subTitle: "Second subtitle",
					categoryId: 3,
					subCategoryId: 4,
					endDate: "2023-12-15",
					condition: true,
					description: "Second description",
					listingPrice: "20.00",
					reservePrice: "15.00",
					creditCardPayment: false,
					bankTransferPayment: true,
					bitcoinPayment: false,
					pickUp: false,
					shippingOption: "courier",
					category: "Category Two",
				},
			];

			vi.mocked(api.getListings).mockResolvedValue(
				mockApiListings.map((api) => ({
					...api,
					endDate: new Date(api.endDate),
					listingPrice: Number(api.listingPrice),
					reservePrice: Number(api.reservePrice),
				})),
			);

			const { fetchListings } = useListingStore.getState();
			await fetchListings();

			const state = useListingStore.getState();

			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
			expect(state.listings).toHaveLength(2);

			// Check if the data is transformed correctly
			expect(state.listings[0].id).toBe(mockApiListings[0].id);
			expect(state.listings[0].title).toBe(mockApiListings[0].title);
			expect(state.listings[0].listingPrice).toBe(10);
			expect(state.listings[1].id).toBe(mockApiListings[1].id);
			expect(state.listings[1].title).toBe(mockApiListings[1].title);
			expect(state.listings[1].listingPrice).toBe(20);
		});
	});

	describe("fetchCategories and fetchSubCategories", () => {
		it("should fetch and store categories", async () => {
			const mockCategories: Category[] = [
				{ id: 1, category_name: "Electronics", parent_id: 0, active: true },
				{ id: 2, category_name: "Clothing", parent_id: 0, active: true },
			];

			vi.mocked(api.getCategories).mockResolvedValue(mockCategories);

			const { fetchCategories } = useListingStore.getState();
			await fetchCategories();

			const state = useListingStore.getState();
			expect(state.categories).toEqual(mockCategories);
		});

		it("should fetch and store subcategories", async () => {
			const mockSubCategories: Category[] = [
				{ id: 3, category_name: "Laptops", parent_id: 1, active: true },
				{ id: 4, category_name: "Phones", parent_id: 1, active: true },
			];

			vi.mocked(api.getCategories).mockResolvedValue(mockSubCategories);

			const { fetchSubCategories } = useListingStore.getState();
			await fetchSubCategories(1);

			const state = useListingStore.getState();
			expect(state.subCategories).toEqual(mockSubCategories);
			expect(api.getCategories).toHaveBeenCalledWith(1);
		});
	});

	describe("updateListing", () => {
		it("should format and send update data correctly", async () => {
			const updateListing = {
				title: "Updated Listing",
				description: "New description",
				endDate: new Date("2024-12-31"),
				listingPrice: 199.99,
				reservePrice: 150,
			} as Listing;

			vi.mocked(api.updateListing).mockResolvedValue({
				...updateListing,
				id: 1,
				subTitle: "",
				categoryId: 1,
				subCategoryId: 1,
				condition: true,
				creditCardPayment: true,
				bankTransferPayment: false,
				bitcoinPayment: false,
				pickUp: true,
				shippingOption: "post",
			});

			const { updateListing: update } = useListingStore.getState();
			await update(1, updateListing);

			// Check if api was called with correctly formatted data
			expect(api.updateListing).toHaveBeenCalledWith(
				1,
				expect.objectContaining({
					title: "Updated Listing",
					description: "New description",
					endDate: format(new Date("2024-12-31"), "yyyy-MM-dd"),
					listingPrice: "199.99",
					reservePrice: "150",
				}),
			);

			const state = useListingStore.getState();
			expect(state.isLoading).toBe(false);
		});
	});

	describe("addListing", () => {
		it("should format and send new listing data correctly", async () => {
			const newListing = {
				title: "New Listing",
				description: "Brand new item",
				endDate: new Date("2023-11-30"),
				listingPrice: 50,
				reservePrice: 25,
				categoryId: 1,
				subCategoryId: 3,
				condition: true,
				creditCardPayment: true,
			} as Listing;

			vi.mocked(api.addListing).mockResolvedValue({
				...newListing,
				id: 10,
				subTitle: "",
				bankTransferPayment: false,
				bitcoinPayment: false,
				pickUp: false,
				shippingOption: "",
			});

			const { addListing: add } = useListingStore.getState();
			await add(newListing);

			// Check if api was called with correctly formatted data
			expect(api.addListing).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "New Listing",
					description: "Brand new item",
					endDate: format(new Date("2023-11-30"), "yyyy-MM-dd"),
					listingPrice: "50",
					reservePrice: "25",
				}),
			);

			const state = useListingStore.getState();
			expect(state.isLoading).toBe(false);
		});

		it("should handle errors when adding a listing", async () => {
			vi.mocked(api.addListing).mockRejectedValue(new Error("Network error"));

			const newListing = {
				title: "Error Listing",
				endDate: new Date(),
			} as Listing;

			const { addListing: add } = useListingStore.getState();
			await expect(add(newListing)).rejects.toThrow();

			const state = useListingStore.getState();
			expect(state.error).toBe("Network error");
			expect(state.isLoading).toBe(false);
		});
	});
});
