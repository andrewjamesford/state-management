import { pool } from "../db.js";
import type { Listing } from "./listing.model.js";

/**
 * getListings - gets all listings from the database
 * @returns array of listings
 */
export async function getListings(): Promise<Listing[]> {
	try {
		const result = await pool.query(
			`SELECT
			l.id,
			l.title,
			l.sub_title as subTitle,
			-- Select parent_id from categories for the categoryId field
			parent_cat.parent_id as categoryId,
			-- Select the actual category id (which is the subcategory) for subCategoryId
			c.id as subCategoryId,
			l.end_date as endDate,
			l.listing_description as description, -- Alias to 'description' to match Listing interface
			l.condition_new as condition, -- Alias to 'condition' to match Listing interface
			l.listing_price as listingPrice,
			l.reserve_price as reservePrice,
			l.credit_card_payment as creditCardPayment,
			l.bank_transfer_payment as bankTransferPayment,
			l.bitcoin_payment as bitcoinPayment,
			l.pick_up as pickUp,
			l.shipping_option as shippingOption,
			c.category_name AS category -- This is the subcategory name
			FROM listings l
			INNER JOIN categories c ON c.id = l.category_id -- Join on the subcategory ID stored in listings
			LEFT JOIN categories parent_cat ON parent_cat.id = c.parent_id -- Join to get the parent category
			ORDER BY l.id DESC;
      `,
		);
		// Ensure numeric types are correctly cast if necessary, although node-postgres often handles this.
		// If issues arise, consider explicit casting in the query or post-processing.
		return (result.rows as Listing[]) ?? [];
	} catch (error) {
		console.error("Error fetching listings:", error);
		throw new Error(error instanceof Error ? error.message : String(error));
	}
}

/**
 * GetListing - gets a single listing from the database by ID
 * @param {number} id - The listing ID
 * @returns listing object or null if not found
 */
export async function getListing(id: number): Promise<Listing | null> {
	try {
		const result = await pool.query(
			`SELECT
			l.id,
			l.title,
			l.sub_title as subTitle,
			-- Select parent_id from categories for the categoryId field
			parent_cat.parent_id as categoryId,
			-- Select the actual category id (which is the subcategory) for subCategoryId
			c.id as subCategoryId,
			l.end_date as endDate,
			l.listing_description as description, -- Alias to 'description' to match Listing interface
			l.condition_new as condition, -- Alias to 'condition' to match Listing interface
			l.listing_price as listingPrice,
			l.reserve_price as reservePrice,
			l.credit_card_payment as creditCardPayment,
			l.bank_transfer_payment as bankTransferPayment,
			l.bitcoin_payment as bitcoinPayment,
			l.pick_up as pickUp,
			l.shipping_option as shippingOption,
			c.category_name AS category -- This is the subcategory name
			FROM listings l
			INNER JOIN categories c ON c.id = l.category_id -- Join on the subcategory ID stored in listings
			LEFT JOIN categories parent_cat ON parent_cat.id = c.parent_id -- Join to get the parent category
			WHERE l.id = $1
			LIMIT 1`,
			[id],
		);
		// Ensure numeric types are correctly cast if necessary
		return (result.rows[0] as Listing) ?? null;
	} catch (error) {
		console.error(`Error fetching listing with ID ${id}:`, error);
		throw new Error(error instanceof Error ? error.message : String(error));
	}
}

/**
 * addListing - adds a new listing to the database
 * @param {object} listingDetails - Listing details including subCategoryId
 * @returns {Promise<number>} number of rows affected (should be 1 on success)
 */
export const addListing = async (listingDetails: Listing): Promise<number> => {
	try {
		const {
			title,
			// categoryId is the parent category, not stored directly in listings.category_id
			subCategoryId, // Use subCategoryId for the category_id column
			subTitle,
			endDate, // Expecting ISO string from client API
			description, // Expecting 'description' field from client API
			condition, // Expecting 'condition' field from client API
			listingPrice,
			reservePrice,
			creditCardPayment,
			bankTransferPayment,
			bitcoinPayment,
			pickUp,
			shippingOption,
		} = listingDetails;

		const result = await pool.query(
			`INSERT INTO listings (
			title,
			category_id, -- This column stores the subcategory ID
			sub_title,
			end_date,
			listing_description, -- Column name in DB
			condition_new, -- Column name in DB
			listing_price,
			reserve_price,
			credit_card_payment,
			bank_transfer_payment,
			bitcoin_payment,
			pick_up,
			shipping_option)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
		`,
			[
				title,
				subCategoryId, // Corrected: Insert subCategoryId into category_id column
				subTitle,
				endDate,
				description,
				condition,
				listingPrice,
				reservePrice,
				creditCardPayment,
				bankTransferPayment,
				bitcoinPayment,
				pickUp,
				shippingOption,
			],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error adding listing: ${error.message}`, error);
			throw new Error(`Error adding listing: ${error?.message}`);
		}
		console.error("Error adding listing: Unknown error", error);
		throw new Error("Error adding listing: Unknown error");
	}
};

/**
 * UpdateListing - updates a listing in the database
 * @param {number} id - listing id
 * @param {Listing} listingDetails - Listing details including subCategoryId
 * @returns {Promise<number>} number of rows affected
 */
export const updateListing = async (
	id: number,
	listingDetails: Listing,
): Promise<number> => {
	try {
		const {
			title,
			// categoryId is the parent category, not stored directly in listings.category_id
			subCategoryId, // Use subCategoryId for the category_id column
			subTitle,
			endDate, // Expecting ISO string from client API
			description, // Expecting 'description' field from client API
			condition, // Expecting 'condition' field from client API
			listingPrice,
			reservePrice,
			creditCardPayment,
			bankTransferPayment,
			bitcoinPayment,
			pickUp,
			shippingOption,
		} = listingDetails;

		// Check if listing exists (optional but good practice)
		// const existingListing = await getListing(id);
		// if (!existingListing) {
		// 	throw new Error(`Listing with ID ${id} not found`);
		// }

		const result = await pool.query(
			`UPDATE listings SET
			title=$1,
			category_id=$2, -- This column stores the subcategory ID
			sub_title=$3,
			end_date=$4,
			listing_description=$5, -- Column name in DB
			condition_new=$6, -- Column name in DB
			listing_price=$7,
			reserve_price=$8,
			credit_card_payment=$9,
			bank_transfer_payment=$10,
			bitcoin_payment=$11,
			pick_up=$12,
			shipping_option=$13
			WHERE id=$14;`,
			[
				title,
				subCategoryId, // Corrected: Update category_id column with subCategoryId
				subTitle,
				endDate,
				description,
				condition,
				listingPrice,
				reservePrice,
				creditCardPayment,
				bankTransferPayment,
				bitcoinPayment,
				pickUp,
				shippingOption,
				id,
			],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		if (error instanceof Error) {
			console.error(
				`Error updating listing with ID ${id}: ${error.message}`,
				error,
			);
			throw new Error(`Error updating listing: ${error.message}`);
		}
		console.error(`Error updating listing with ID ${id}: Unknown error`, error);
		throw new Error("Error updating listing: Unknown error");
	}
};

// Note: Draft listing functionality is not implemented in the repository layer yet.
// You would need separate functions like getDraftListingByUserId and saveDraftListingByUserId
// potentially interacting with a different table or adding a 'status' column to the listings table.
// The API layer changes for drafts are client-side endpoint changes only for now.
