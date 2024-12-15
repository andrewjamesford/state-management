import { query } from "../db.cjs";

/**
 * Retrieves categories from the database based on the provided parent ID and active status.
 *
 * @param {number} [parentId=0] - The ID of the parent category. Defaults to 0.
 * @param {boolean} [active=true] - The active status of the categories. Defaults to true.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 * @throws {Error} If there is an error executing the query.
 */
export async function getCategories(parentId = 0, active = true) {
	try {
		const result = await query(
			"SELECT c.id, c.category_name, c.parent_id FROM categories c WHERE c.parent_id = $1 AND c.active = $2 ORDER BY c.category_name",
			[parentId, active],
		);
		return result.rows;
	} catch (error) {
		throw new Error(error);
	}
}
