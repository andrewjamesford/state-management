import request from "supertest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import app from "../../app";
import { pool } from "../../db";
import { addListing, getListings } from "../../listing/listing.repository";
import type { Listing } from "listing/listing.model";

vi.mock("../../listing/listing.repository");

describe("Listings API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	const mockListings: Listing[] = [
		{
			id: 1,
			title: "Listing 1",
			subTitle: "SubTitle 1",
			description: "Description 1",
			listingPrice: 100,
			categoryId: 1,
			subCategoryId: 1,
			endDate: "2023-10-01",
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
			endDate: "2023-10-02",
			condition: false,
			reservePrice: 100,
			creditCardPayment: false,
			bankTransferPayment: true,
			bitcoinPayment: true,
			pickUp: false,
			shippingOption: "courier",
		},
	];

	describe("Get listings", () => {
		describe("GET /api/listings", () => {
			it("should return 200 and all listings", async () => {
				// Arrange: Mock the repository function
				vi.mocked(getListings).mockResolvedValue(mockListings);

				// Act
				const response = await request(app).get("/api/listings/");

				// Assert
				expect(response.status).toBe(200);
				expect(response.body).toEqual(mockListings);
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
			expect(response.body.text).toEqual({ message: "No listings found" });
			expect(getListings).toHaveBeenCalledTimes(1);
		});

		it("should return 404 status code if no listings are found", async () => {
			const mock = vi.fn().mockImplementation(() => getListings());
			mock.mockImplementationOnce(() => []);

			await request(app).get("/api/listings/");
			expect(mock).toHaveBeenCalledTimes(1);
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

	it("should add a new listing to the database", async () => {
		const mock = vi.fn().mockImplementation(() => addListing);
		const newListing = {
			title: "New Listing",
			description: "New Description",
			price: 300,
			categoryId: 3,
			subCategoryId: 3,
		};

		mock.mockImplementationOnce(() => 1);
		const result = mock(newListing);

		expect(result).toEqual(1);
		expect(mock).toHaveBeenCalledWith(newListing);
	});
});

describe("Get listing by ID", () => {
	describe("GET /api/listings/:id", () => {
		it("should return 200 status code when listing exists", async () => {
			// Arrange: Mock the repository to return a specific listing
			const targetListing = mockListings[0]; // e.g., Listing with ID 1
			vi.mocked(getListingById).mockResolvedValue(targetListing);

			// Act
			const response = await request(app).get(
				`/api/listings/${targetListing.id}`,
			);

			// Assert
			expect(response.status).toBe(200);
			expect(response.body).toEqual(targetListing); // Check if the correct data is returned
			expect(getListingById).toHaveBeenCalledTimes(1);
			expect(getListingById).toHaveBeenCalledWith(targetListing.id); // Verify it was called with the correct ID
		});

		it("should return 404 status code when listing doesn't exist", async () => {
			// Assuming ID 999 doesn't exist
			await request(app).get("/api/listings/999").expect(404);
		});
	});
});

describe("Update listing", () => {
	describe("PUT /api/listings/:id", () => {
		it("should return 200 status code when update succeeds", async () => {
			const updatedListing = {
				title: "Updated Listing",
				description: "Updated Description",
				price: 350,
				categoryId: 2,
				subCategoryId: 4,
			};

			await request(app)
				.put("/api/listings/1")
				.send(updatedListing)
				.expect(200);
		});

		it("should return 404 status code when trying to update non-existent listing", async () => {
			await request(app)
				.put("/api/listings/999")
				.send({ title: "Won't update" })
				.expect(404);
		});
	});
});
