import request from "supertest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import app from "../../app.js";
import {
	addListing,
	getListings,
	getListing,
} from "../../listing/listing.repository.js";
import type { Listing } from "../../listing/listing.model.js";
import { mock } from "node:test";

vi.mock("../../listing/listing.repository.js");

const mockListings: Listing[] = [
	{
		id: 1,
		title: "Listing 1",
		subTitle: "SubTitle 1",
		description: "Description 1",
		listingPrice: 100,
		categoryId: 1,
		subCategoryId: 1,
		endDate: new Date("2023-10-01"),
		condition: true,
		reservePrice: 50,
		creditCardPayment: true,
		bankTransferPayment: false,
		bitcoinPayment: false,
		pickUp: true,
		shippingOption: "post",
	},
	{
		id: 2,
		title: "Listing 2",
		subTitle: "SubTitle 2",
		description: "Description 2",
		listingPrice: 200,
		categoryId: 2,
		subCategoryId: 2,
		endDate: new Date("2023-10-02"),
		condition: false,
		reservePrice: 100,
		creditCardPayment: false,
		bankTransferPayment: true,
		bitcoinPayment: true,
		pickUp: false,
		shippingOption: "courier",
	},
];

describe("Listings API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("Get listings", () => {
		describe("GET /api/listings", () => {
			it("should return 200 and all listings", async () => {
				// Arrange: Mock the repository function
				vi.mocked(getListings).mockResolvedValue(mockListings);

				// Act
				const response = await request(app).get("/api/listings/");

				// Assert
				expect(response.status).toBe(200);
				// Check only title and reservePrice for each listing instead of entire body
				expect(response.body.length).toBe(mockListings.length);
				response.body.forEach((listing: Listing, index: number) => {
					expect(listing.title).toBe(mockListings[index].title);
					expect(listing.reservePrice).toBe(mockListings[index].reservePrice);
				});
				expect(getListings).toHaveBeenCalledTimes(1);
			});
		});

		it("should return 404 and empty array if no listings are found", async () => {
			// Arrange
			vi.mocked(getListings).mockResolvedValue([]);

			// Act
			const response = await request(app).get("/api/listings/");

			// Assert
			expect(response.status).toBe(404); // API returns 404 when empty
			expect(response.body).toEqual({ message: "No listings found" });
			expect(getListings).toHaveBeenCalledTimes(1);
		});

		it("should return all listings", async () => {
			const mock = vi.fn().mockImplementation(() => getListings());
			mock.mockImplementationOnce(() => mockListings);

			expect(mock()).toEqual(mockListings);
			expect(mock).toHaveBeenCalledTimes(1);
		});

		it("should return empty array if no listings are available", async () => {
			const mock = vi.fn().mockImplementation(() => getListings());
			mock.mockImplementationOnce(() => []);

			expect(mock()).toEqual([]);
			expect(mock).toHaveBeenCalledTimes(1);
		});

		it("should return 500 if the database query fails", async () => {
			// Arrange
			const dbError = new Error("Database query failed");
			vi.mocked(getListings).mockRejectedValue(dbError);

			// Act
			const response = await request(app).get("/api/listings/");

			// Assert
			expect(response.status).toBe(500);
			// Optionally check the error message if your error handler sends one
			// expect(response.body).toEqual({ message: 'Internal Server Error' });
			expect(getListings).toHaveBeenCalledTimes(1);
		});
	});
});

describe("addListing", () => {
	it("should return 200 status code", async () => {
		request(app).post("/api/listings/").expect(200);
	});

	it("should return 400 status code for invalid input", async () => {
		const invalidListing = {
			title: "",
			description: "Invalid Listing",
			price: -100,
			categoryId: null,
			subCategoryId: null,
		};

		await request(app).post("/api/listings/").send(invalidListing).expect(400);
	});
});

describe("Get listing by ID", () => {
	describe("GET /api/listings/:id", () => {
		it("should return 200 and the correct listing data when the listing exists", async () => {
			// Arrange: Mock the repository to return a specific listing
			const targetListing = mockListings[0]; // e.g., Listing with ID 1
			if (!targetListing) {
				throw new Error(
					"Target listing is undefined. Ensure mockListings is not empty.",
				);
			}
			vi.mocked(getListing).mockResolvedValue(targetListing);

			// Act
			const response = await request(app).get(
				`/api/listings/${targetListing.id}`,
			);
			expect(response.body.id).toBe(targetListing.id);
			expect(response.body.title).toBe(targetListing.title);
			expect(response.body.subTitle).toBe(targetListing.subTitle);
			expect(response.body.description).toBe(targetListing.description);
			expect(response.body.listingPrice).toBe(targetListing.listingPrice);
			// Verify that the repository function is called with the correct listing ID.
			expect(getListing).toHaveBeenCalledWith(targetListing.id); // Verify it was called with the correct ID
			expect(response.body.subCategoryId).toBe(targetListing.subCategoryId);
			expect(new Date(response.body.endDate)).toEqual(targetListing.endDate);
			expect(response.body.condition).toBe(targetListing.condition);
			expect(response.body.reservePrice).toBe(targetListing.reservePrice);
			expect(response.body.creditCardPayment).toBe(
				targetListing.creditCardPayment,
			);
			expect(response.body.bankTransferPayment).toBe(
				targetListing.bankTransferPayment,
			);
			expect(response.body.bitcoinPayment).toBe(targetListing.bitcoinPayment);
			expect(response.body.pickUp).toBe(targetListing.pickUp);
			expect(response.body.shippingOption).toBe(targetListing.shippingOption);
			// Assert
			expect(response.status).toBe(200);
			expect(getListing).toHaveBeenCalledTimes(1);
			expect(getListing).toHaveBeenCalledWith(targetListing.id); // Verify it was called with the correct ID
		});
	});
});

describe("Update listing", () => {
	describe("PUT /api/listings/:id", () => {
		it("should return 400 status code when trying to update non-existent listing", async () => {
			const updatedListing = {
				id: 999,
				title: "Updated Listing",
				subTitle: "Updated SubTitle",
				description: "Updated Description",
				listingPrice: 350,
				categoryId: 2,
				subCategoryId: 4,
				endDate: new Date(),
				condition: true,
				reservePrice: 200,
				creditCardPayment: true,
				bankTransferPayment: false,
				bitcoinPayment: false,
				pickUp: true,
				shippingOption: "post",
			};

			// Mock getListing to return null for non-existent listing
			vi.mocked(getListing).mockResolvedValue(null);

			await request(app)
				.put("/api/listings/999")
				.send(updatedListing)
				.expect(400);
		});
	});
});
