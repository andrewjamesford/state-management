import { pool } from "../db";

/**
 * getListings - gets all listings from the database
 * @returns array of listings
 */
export async function getListings() {
	try {
		const result = await pool.query(
			`SELECT
			l.id,
			l.title, 
			l.sub_title as subTitle, 
			l.category_id as categoryId,
			c.id as subCategoryId,
			l.end_date as endDate,
			l.listing_description as listingDescription, 
			l.condition_new as condition, 
			l.listing_price as listingPrice,
			l.reserve_price as reservePrice,
			l.credit_card_payment as creditCardPayment,
			l.bank_transfer_payment as bankTransferPayment,
			l.bitcoin_payment as bitcoinPayment,
			l.pick_up as pickUp,
			l.shipping_option as shippingOption,
			c.category_name AS category 
			FROM listings l
			INNER JOIN categories c ON c.id = l.category_id
      `,
		);
		return result.rows ?? [];
	} catch (error) {
		console.log(error);
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
			`SELECT
			l.id,
			l.title,
			l.sub_title as subTitle,
			c.parent_id as categoryId,
			c.id as subCategoryId,
			l.end_date as endDate,
			l.listing_description as listingDescription, 
			l.condition_new as condition, 
			l.listing_price as listingPrice,
			l.reserve_price as reservePrice,
			l.credit_card_payment as creditCardPayment,
			l.bank_transfer_payment as bankTransferPayment,
			l.bitcoin_payment as bitcoinPayment,
			l.pick_up as pickUp,
			l.shipping_option as shippingOption,
			c.category_name AS category
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

export interface ListingDetails {
	titleCategory: TitleCategory;
	itemDetails: ItemDetails;
	pricePayment: PricePayment;
	shipping: Shipping;
}

export interface Listing {
	listing: ListingDetails;
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
 * updateListing - updates a listing in the database
 * @param {number} id - listing id
 * @param {ListingDetails} listingDetails
 * @returns {Promise<number>} number of rows affected
 */
export const updateListing = async (
	id: number,
	listingDetails: ListingDetails,
): Promise<number> => {
	try {
		const { listing } = listingDetails;
		const { titleCategory, itemDetails, pricePayment, shipping } = listing;
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
			`UPDATE listings SET 
			title=$1, category_id=$2, sub_title=$3, end_date=$4, 
			listing_description=$5, condition_new=$6, listing_price=$7, 
			reserve_price=$8, credit_card_payment=$9, bank_transfer_payment=$10, 
			bitcoin_payment=$11, pick_up=$12, shipping_option=$13 
			WHERE id=$14;`,
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
				id,
			],
		);
		return result.rowCount ?? 0;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Error updating listing: ${error.message}`);
		}
		throw new Error("Error updating listing: Unknown error");
	}
};
