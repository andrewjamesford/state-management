import { pool } from "../db";

/**
 * Retrieves categories from the database based on the provided parent ID and active status.
 *
 * @param {number} [parentId=0] - The ID of the parent category. Defaults to 0.
 * @param {boolean} [active=true] - The active status of the categories. Defaults to true.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 * @throws {Error} If there is an error executing the query.
 */
export async function getCategories(parentId: number, active: boolean) {
	try {
		const result = await pool.query(
			"SELECT * FROM categories WHERE parent_id = $1 AND active = $2 ORDER BY category_name",
			[parentId, active],
		);
		return result.rows ?? [];
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		console.error(String(error));
		throw new Error(String(error));
	}
}
