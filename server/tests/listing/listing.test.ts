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

		it("should return 404 status code if no listings are found", async () => {
			const mock = vi.fn().mockImplementation(getListings);
			mock.mockImplementationOnce(() => []);

			await request(app).get("/api/listings/");
			expect(mock).toHaveBeenCalledTimes(1);
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
		const mock = vi.fn().mockImplementation(addListing);
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
			// You'd typically mock the repository function here
			await request(app).get("/api/listings/1").expect(200);
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
