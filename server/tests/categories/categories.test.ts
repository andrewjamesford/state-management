import request from "supertest";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import app from "../../app.js";
import { pool } from "../../db.js";
import { getCategories } from "../../categories/categories.repository.js";

interface QueryResult<T = unknown> {
	rows: T[];
	command: string;
	rowCount: number;
	oid: number;
	fields: unknown[];
}

interface Category {
	id: number;
	category_name: string;
	parent_id: number;
}

const mockCategories: QueryResult<Category> = {
	rows: [
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
	command: "SELECT",
	rowCount: 2,
	oid: 1,
	fields: [],
};

describe("Categories API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("GET /api/categories", () => {
		it("should return 200 status code", async () => {
			request(app).get("/api/categories?parentId=0").expect(200);
		});
	});

	describe("getCategories repository", () => {
		it("should return the categories", async () => {
			const mock = vi.fn().mockImplementation(getCategories);
			mock.mockImplementationOnce(() => mockCategories);

			expect(mock()).toEqual(mockCategories);
			expect(mock).toHaveBeenCalledTimes(1);
		});

		it("should return an empty array if no categories available", async () => {
			const mock = vi.fn().mockImplementation(getCategories);
			mock.mockImplementationOnce(() => []);

			expect(mock()).toEqual([]);
			expect(mock).toHaveBeenCalledTimes(1);
		});

		it("should throw an error if database query fails", async () => {
			const mockError = new Error("Database query failed");

			vi.spyOn(pool, "query").mockRejectedValue(mockError);

			await expect(getCategories()).rejects.toThrow("Database query failed");
		});
	});
});
