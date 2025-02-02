import { pool } from "../db";

/**
 * getListings - gets all listings from the database
 * @returns array of listings
 */
export async function getListings() {
	try {
		const result = await pool.query(
			`SELECT l.id, l.title, l.sub_title, l.listing_description, l.listing_price, l.condition_new, c.category_name AS category FROM listings l INNER JOIN categories c ON c.id = l.category_id
      `,
		);
		return result.rows ?? [];
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : String(error));
	}
}

/**
 * getListing - gets a single listing from the database by ID
 * @param {number} id - The listing ID
 * @returns listing object or null if not found
 */
export async function getListing(id: number) {
	try {
		const result = await pool.query(
			`SELECT l.id, l.title, l.sub_title, l.listing_description, l.listing_price, l.condition_new, c.category_name AS category 
			FROM listings l 
			INNER JOIN categories c ON c.id = l.category_id 
			WHERE l.id = $1
			LIMIT 1`,
			[id],
		);
		return result.rows[0] ?? null;
	} catch (error) {
		throw new Error(error instanceof Error ? error.message : String(error));
	}
}

/**
 * addListing - adds a new listing to the database
 * @param {object} listingDetails
 * @returns {object} listing
 */
interface TitleCategory {
	title: string;
	categoryId: number;
	subTitle: string;
	endDate: string;
}

interface ItemDetails {
	condition: boolean;
	description: string;
}

interface PricePayment {
	listingPrice: number;
	reservePrice: number;
	creditCardPayment: boolean;
	bankTransferPayment: boolean;
	bitcoinPayment: boolean;
}

interface Shipping {
	pickUp: boolean;
	shippingOption: string;
}

interface ListingDetails {
	titleCategory: TitleCategory;
	itemDetails: ItemDetails;
	pricePayment: PricePayment;
	shipping: Shipping;
}

export const addListing = async (
	listingDetails: ListingDetails,
): Promise<number> => {
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

		const result = await pool.query(
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
		if (error instanceof Error) {
			throw new Error(`Error adding listing: ${error?.message}`);
		}
		throw new Error("Error adding listing: Unknown error");
	}
};

/**
 * addDraftListing - adds a draft to the database.
 * @param {object} draft
 * @param {string} userId
 * @returns rowcount
 */
interface Draft {
	// Define the structure of the draft object here
	[key: string]: string | number | boolean | object;
}

export const addDraftListing = async (
	draft: Draft,
	userId: string,
): Promise<number> => {
	try {
		const result = await pool.query(
			`INSERT INTO listings_draft (
		draft, 
		user_id) 
		VALUES ($1, $2);`,
			[draft, userId],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error updating draft: ${error.message}`);
		}
		throw new Error("Error updating draft: Unknown error");
	}
};

/**
 * updateDraftListing - updates a draft listing in the database.
 * @param {object} draft
 * @param {string} userId
 * @returns rowcount
 */
interface UpdateDraft {
	[key: string]: string | number | boolean | object;
}

export const updateDraftListing = async (
	draft: UpdateDraft,
	userId: string,
): Promise<number> => {
	try {
		const result = await pool.query(
			`UPDATE listings_draft SET 
		draft=$1 WHERE user_id=$2;`,
			[draft, userId],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error updating draft: ${error.message}`);
		}
		throw new Error("Error updating draft: Unknown error");
	}
};

/**
 * getDraftListing - gets a draft from the database.
 * @param {string} userId
 * @returns draft listing
 */
interface DraftListing {
	user_id: string;
	draft: Record<string, unknown>;
}

export const getDraftListing = async (
	userId: string,
): Promise<DraftListing[]> => {
	try {
		const result = await pool.query(
			`SELECT user_id, draft 
			FROM listings_draft 
			WHERE user_id=$1`,
			[userId],
		);
		return result.rows as DraftListing[];
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error getting draft: ${error.message}`);
		}
		throw new Error("Error getting draft: Unknown error");
	}
};
