import { query } from "../db.cjs";

/**
 * getListings - gets all listings from the database
 * @returns array of listings
 */
export const getListings = async () => {
	try {
		const result = await query(
			`SELECT l.id, l.title, l.sub_title, l.listing_description, l.listing_price, l.condition_new, c.category_name AS category FROM listings l INNER JOIN categories c ON c.id = l.category_id
      `,
		);
		return result.rows ?? [];
	} catch (error) {
		throw new Error(error);
	}
};

/**
 * addListing - adds a new listing to the database
 * @param {object} listingDetails
 * @returns {object} listing
 */
export const addListing = async (listingDetails) => {
	try {
		const { titleCategory, itemDetails, pricePayment, shipping } =
			listingDetails;

		const { title, categoryId, subTitle, endDate } = titleCategory;

		const { condition, description } = itemDetails;

		const {
			listingPrice,
			reservePrice,
			creditCardPayment,
			bankTransferPayment,
			bitcoinPayment,
		} = pricePayment;

		const { pickUp, shippingOption } = shipping;

		const result = await query(
			`INSERT INTO listings (
			title, 
			category_id, 
			sub_title, 
			end_date, 
			listing_description, 
			condition_new, 
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
				categoryId,
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
		throw new Error(`Error adding listing: ${error.message}`);
	}
};

/**
 * addDraftListing - adds a draft to the database.
 * @param {object} draft
 * @param {string} userId
 * @returns rowcount
 */
export const addDraftListing = async (draft, userId) => {
	try {
		const result = await query(
			`INSERT INTO listings_draft (
		draft, 
		user_id) 
		VALUES ($1, $2);`,
			[draft, userId],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		throw new Error(`Error adding listing: ${error.message}`);
	}
};

/**
 * updateDraftListing - updates a draft listing in the database.
 * @param {object} draft
 * @param {string} userId
 * @returns rowcount
 */
export const updateDraftListing = async (draft, userId) => {
	try {
		const result = await query(
			`UPDATE listings_draft SET 
		draft=$1 WHERE user_id=$2;`,
			[draft, userId],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		throw new Error(`Error updating draft: ${error.message}`);
	}
};

/**
 * getDraftListing - gets a draft from the database.
 * @param {string} userId
 * @returns draft listing
 */
export const getDraftListing = async (userId) => {
	try {
		const result = await query(
			`SELECT user_id, draft 
			FROM listings_draft 
			WHERE user_id=$1`,
			[userId],
		);
		return result.rows;
	} catch (error) {
		throw new Error(`Error getting draft: ${error.message}`);
	}
};
