import { format } from "date-fns";
import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "~/api";
import type { Category, Listing, RawListing } from "~/models";
import { useListingStore } from "~/store/listingStore";

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
		const store = useListingStore.getState();
		useListingStore.setState({
			listing: {
				id: 0,
				title: "",
				subTitle: "",
				categoryId: 0,
				subCategoryId: 0,
				endDate: format(new Date(), "yyyy-MM-dd"),
				condition: false,
				description: "",
				listingPrice: "0",
				reservePrice: "0",
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
				endDate: "2023-12-31",
				condition: true,
				description: "Test description",
				listingPrice: "100.00",
				reservePrice: "50.00",
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
			const mockRawListing: RawListing = {
				id: 5,
				title: "API Listing",
				subtitle: "From API",
				categoryid: 2,
				subcategoryid: 4,
				enddate: "2023-10-15",
				condition: true,
				listingdescription: "Description from API",
				listingprice: "75.00",
				reserveprice: "25.00",
				creditcardpayment: true,
				banktransferpayment: true,
				bitcoinpayment: false,
				pickup: false,
				shippingoption: "courier",
			};

			vi.mocked(api.getListing).mockResolvedValue({
				ok: true,
				json: async () => mockRawListing,
			} as Response);

			const { fetchListing } = useListingStore.getState();
			await fetchListing("5");

			const state = useListingStore.getState();

			// Verify loading state changed
			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();

			// Verify the data was transformed and stored correctly
			expect(state.listing).toEqual({
				id: mockRawListing.id,
				title: mockRawListing.title,
				subTitle: mockRawListing.subtitle,
				categoryId: mockRawListing.categoryid,
				subCategoryId: mockRawListing.subcategoryid,
				endDate: mockRawListing.enddate,
				condition: mockRawListing.condition,
				description: mockRawListing.listingdescription,
				listingPrice: mockRawListing.listingprice,
				reservePrice: mockRawListing.reserveprice,
				creditCardPayment: mockRawListing.creditcardpayment,
				bankTransferPayment: mockRawListing.banktransferpayment,
				bitcoinPayment: mockRawListing.bitcoinpayment,
				pickUp: mockRawListing.pickup,
				shippingOption: mockRawListing.shippingoption,
			});
		});

		it("should handle API errors", async () => {
			// Mock API error response
			vi.mocked(api.getListing).mockResolvedValue({
				ok: false,
				status: 404,
				statusText: "Not Found",
			} as Response);

			const { fetchListing } = useListingStore.getState();
			await fetchListing("999");

			const state = useListingStore.getState();

			expect(state.isLoading).toBe(false);
			expect(state.error).toBe("Failed to fetch listing");
		});
	});

	describe("fetchListings", () => {
		it("should fetch and update multiple listings", async () => {
			// Mock API response with multiple listings
			const mockRawListings: RawListing[] = [
				{
					id: 1,
					title: "First Listing",
					subtitle: "First subtitle",
					categoryid: 1,
					subcategoryid: 2,
					enddate: "2023-11-30",
					condition: false,
					listingdescription: "First description",
					listingprice: "10.00",
					reserveprice: "5.00",
					creditcardpayment: true,
					banktransferpayment: false,
					bitcoinpayment: false,
					pickup: true,
					shippingoption: "post",
				},
				{
					id: 2,
					title: "Second Listing",
					subtitle: "Second subtitle",
					categoryid: 3,
					subcategoryid: 4,
					enddate: "2023-12-15",
					condition: true,
					listingdescription: "Second description",
					listingprice: "20.00",
					reserveprice: "15.00",
					creditcardpayment: false,
					banktransferpayment: true,
					bitcoinpayment: false,
					pickup: false,
					shippingoption: "courier",
				},
			];

			vi.mocked(api.getListings).mockResolvedValue({
				ok: true,
				json: async () => mockRawListings,
			} as Response);

			const { fetchListings } = useListingStore.getState();
			await fetchListings();

			const state = useListingStore.getState();

			expect(state.isLoading).toBe(false);
			expect(state.error).toBeNull();
			expect(state.listings.length).toBe(2);

			// Check if the data is transformed correctly
			expect(state.listings[0].id).toBe(mockRawListings[0].id);
			expect(state.listings[0].title).toBe(mockRawListings[0].title);
			expect(state.listings[1].id).toBe(mockRawListings[1].id);
			expect(state.listings[1].title).toBe(mockRawListings[1].title);
		});
	});

	describe("fetchCategories and fetchSubCategories", () => {
		it("should fetch and store categories", async () => {
			const mockCategories = [
				{ id: 1, category_name: "Electronics", parent_id: 0, active: true },
				{ id: 2, category_name: "Clothing", parent_id: 0, active: true },
			];

			vi.mocked(api.getCategories).mockResolvedValue({
				ok: true,
				json: async () => mockCategories,
			} as Response);

			const { fetchCategories } = useListingStore.getState();
			await fetchCategories();

			const state = useListingStore.getState();
			expect(state.categories).toEqual(mockCategories);
		});

		it("should fetch and store subcategories", async () => {
			const mockSubCategories = [
				{ id: 3, category_name: "Laptops", parent_id: 1, active: true },
				{ id: 4, category_name: "Phones", parent_id: 1, active: true },
			];

			vi.mocked(api.getCategories).mockResolvedValue({
				ok: true,
				json: async () => mockSubCategories,
			} as Response);

			const { fetchSubCategories } = useListingStore.getState();
			await fetchSubCategories(1);

			const state = useListingStore.getState();
			expect(state.subCategories).toEqual(mockSubCategories);
			expect(api.getCategories).toHaveBeenCalledWith(1);
		});
	});

	describe("updateListing", () => {
		it("should format and send update data correctly", async () => {
			vi.mocked(api.updateListing).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 1, title: "Updated Listing" }),
			} as Response);

			const updateData = {
				title: "Updated Listing",
				description: "New description",
				endDate: new Date("2024-12-31"),
				listingPrice: 199.99,
				reservePrice: 150,
			};

			const { updateListing } = useListingStore.getState();
			await updateListing("1", updateData);

			// Check if api was called with correctly formatted data
			expect(api.updateListing).toHaveBeenCalledWith(
				"1",
				expect.objectContaining({
					title: "Updated Listing",
					description: "New description",
					endDate: "2024-12-31",
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
			vi.mocked(api.addListing).mockResolvedValue({
				ok: true,
				json: async () => ({ id: 10, title: "New Listing" }),
			} as Response);

			const newListingData = {
				title: "New Listing",
				description: "Brand new item",
				endDate: new Date("2023-11-30"),
				listingPrice: 50,
				reservePrice: 25,
				categoryId: 1,
				subCategoryId: 3,
				condition: true,
				creditCardPayment: true,
			};

			const { addListing } = useListingStore.getState();
			await addListing(newListingData);

			// Check if api was called with correctly formatted data
			expect(api.addListing).toHaveBeenCalledWith(
				expect.objectContaining({
					title: "New Listing",
					description: "Brand new item",
					endDate: "2023-11-30",
					listingPrice: "50",
					reservePrice: "25",
				}),
			);

			const state = useListingStore.getState();
			expect(state.isLoading).toBe(false);
		});

		it("should handle errors when adding a listing", async () => {
			vi.mocked(api.addListing).mockRejectedValue(new Error("Network error"));

			const newListingData = {
				title: "Error Listing",
				endDate: new Date(),
			};

			const { addListing } = useListingStore.getState();

			await expect(addListing(newListingData)).rejects.toThrow();

			const state = useListingStore.getState();
			expect(state.error).toBe("Network error");
			expect(state.isLoading).toBe(false);
		});
	});
});
