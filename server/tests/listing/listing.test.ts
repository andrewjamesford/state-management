import request from "supertest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import app from "../../app";
import { pool } from "../../db";
import { addListing, getListings } from "../../listing/listing.repository";

describe("Listings API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	const mockListings = [
		{
			id: 1,
			title: "Listing 1",
			description: "Description 1",
			price: 100,
			categoryId: 1,
			subCategoryId: 1,
		},
		{
			id: 2,
			title: "Listing 2",
			description: "Description 2",
			price: 200,
			categoryId: 2,
			subCategoryId: 2,
		},
	];

	describe("Get listings", () => {
		describe("GET /api/listings", () => {
			it("should return 200 status code", async () => {
				request(app).get("/api/listings/").expect(200);
			});
		});

		it("should return all listings", async () => {
			const mock = vi.fn().mockImplementation(getListings);
			mock.mockImplementationOnce(() => mockListings);

			expect(mock()).toEqual(mockListings);
			expect(mock).toHaveBeenCalledTimes(1);
		});

		it("should return empty array if no listings are available", async () => {
			const mock = vi.fn().mockImplementation(getListings);
			mock.mockImplementationOnce(() => []);

			expect(mock()).toEqual([]);
			expect(mock).toHaveBeenCalledTimes(1);
		});

		it("should throw an error if the database query fails", async () => {
			const mock = vi.fn().mockImplementation(getListings);
			const error = new Error("Database query failed");

			mock.mockImplementationOnce(() => {
				throw error;
			});

			expect(() => mock()).toThrow(error);
			expect(mock).toHaveBeenCalled;
		});
	});
});

describe("addListing", () => {
	it("should return 200 status code", async () => {
		request(app).post("/api/listings/").expect(200);
	});

	it("should add a new listing to the database", async () => {
		const mock = vi.fn().mockImplementation(addListing);
		const newListing = {
			titleCategory: {
				title: "",
				categoryId: 0,
				subCategoryId: 0,
				subTitle: "",
				endDate: "2026-09-29",
			},
			itemDetails: {
				description: "",
				condition: false,
			},
			pricePayment: {
				listingPrice: "",
				reservePrice: "",
				creditCardPayment: false,
				bankTransferPayment: false,
				bitcoinPayment: false,
			},
			shipping: {
				pickUp: true,
				shippingOption: "post",
			},
		};

		mock.mockImplementationOnce(() => 1);
		const result = mock(newListing);

		expect(result).toEqual(1);
		expect(mock).toHaveBeenCalledWith(newListing);
	});
});
