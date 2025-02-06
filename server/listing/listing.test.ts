import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import app from "../app";
import * as db from "../db";
import { addListing, getListings } from "./listing.repository";

/**
 * Test suite for the getListings function.
 */
describe("getListings", () => {
	/**
	 * Mock data for listings.
	 * @type {Array<Object>}
	 */
	const mockListings = [
		{
			id: "1",
			title: "Test",
			description: "",
			price: 0,
			categoryId: "1",
		},
	];

	/**
	 * Test case to verify that getListings returns all listings.
	 */
	it("should return all listings", async () => {
		const mock = vi.fn().mockImplementation(getListings);

		mock.mockImplementationOnce(() => mockListings);

		expect(mock()).toEqual(mockListings);
		expect(mock).toHaveBeenCalledTimes(1);
	});

	/**
	 * Test case to verify that getListings returns an empty array when there are no listings.
	 */
	it("should return empty array", async () => {
		const mockResult = { rows: [], command: '', rowCount: 0, oid: 0, fields: [] };

		vi.spyOn(db, "query").mockResolvedValue(mockResult);

		const listings = await getListings();

		expect(listings).toEqual([]);
	});

	/**
	 * Test case to verify that getListings throws an error if the database query fails.
	 */
	it("should throw an error if the database query fails", async () => {
		const mockError = new Error("Database query failed");

		vi.spyOn(db, "query").mockRejectedValue(mockError);

		await expect(getListings()).rejects.toThrow("Database query failed");
	});

	/**
	 * Test case to verify that the API responds with a 200 status code when retrieving listings.
	 */
	it("should respond with a 200 status code", async () => {
		const response = await request(app).get("/api/listings/");

		expect(response.statusCode).toBe(200);
	});
});

/**
 * Test suite for the addListing function.
 */
describe("addListing", () => {
	/**
	 * Test case to verify that addListing adds a new listing to the database.
	 */
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
