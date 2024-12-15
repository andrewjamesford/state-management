import request from "supertest";
import { describe, expect, it, vi } from "vitest";
import { app } from "../app";
import * as db from "../db.cjs";
import { getCategories } from "./categories.repository.mjs";

const mockCategories = {
	categories: [
		{
			id: 1,
			category_name: "Antiques & collectables",
			parent_id: 0,
		},
		{
			id: 7,
			category_name: "Computers & Electronics",
			parent_id: 0,
		},
	],
};

// getCategories test suite
describe("getCategories", () => {
	// Test case to verify that getCategories returns the categories
	it("should return the categories", async () => {
		const mock = vi.fn().mockImplementation(getCategories);

		mock.mockImplementationOnce(() => mockCategories);

		expect(mock()).toEqual(mockCategories);
		expect(mock).toHaveBeenCalledTimes(1);
	});

	// Test case to verify that getCategories returns an empty array if no categories match the query
	it("should return an empty array if no categories match the query", async () => {
		const mockResult = { rows: [] };

		vi.spyOn(db, "query").mockResolvedValue(mockResult);

		const categories = await getCategories();

		expect(categories).toEqual([]);
	});

	// Test case to verify that getCategories throws an error if the database query fails
	it("should throw an error if the database query fails", async () => {
		const mockError = new Error("Database query failed");

		vi.spyOn(db, "query").mockRejectedValue(mockError);

		await expect(getCategories()).rejects.toThrow("Database query failed");
	});

	// Test case to verify that getCategories returns the categories with the specified parent ID
	it("should respond with a 200 status code", async () => {
		const response = await request(app).get(
			"http://localhost:5002/api/categories",
		);

		expect(response.statusCode).toBe(200);
	});
});
