import { addDays } from "date-fns";

export interface ApiError {
	message: string;
	status?: number;
	// Add other potential error details if needed
	details?: unknown;
}

// This interface reflects the API payload structure
export interface ApiListing {
	id: number;
	title: string;
	subTitle: string;
	categoryId: number;
	subCategoryId: number;
	endDate: string; // API expects string in yyyy-MM-dd format
	description: string;
	condition: boolean;
	listingPrice: string; // API expects string
	reservePrice: string; // API expects string
	creditCardPayment: boolean;
	bankTransferPayment: boolean;
	bitcoinPayment: boolean;
	pickUp: boolean;
	shippingOption: string;
	category?: string;
}

// This interface reflects the camelCase structure returned by the server repository
export interface Listing {
	id: number;
	title: string;
	subTitle: string;
	// Based on server queries, categoryId is the parent category ID
	categoryId: number;
	// Based on server queries, subCategoryId is the actual category ID stored in listings.category_id
	subCategoryId: number;
	endDate: Date; // Server returns string (date format)
	description: string; // Server column is listing_description
	condition: boolean; // Server column is condition_new
	listingPrice: number; // Server returns numeric, client expects number
	reservePrice: number; // Server returns numeric, client expects number
	creditCardPayment: boolean;
	bankTransferPayment: boolean;
	bitcoinPayment: boolean;
	pickUp: boolean;
	shippingOption: string;
	category?: string; // This is the subcategory name based on server queries
}

export const listingDefault: Listing = {
	id: 0,
	title: "",
	categoryId: 0, // Default to no parent category selected
	subCategoryId: 0, // Default to no subcategory selected
	subTitle: "",
	endDate: new Date(addDays(new Date(), 1)), // Default to current date + 1 (tomorrow), will be updated by form logic
	description: "",
	condition: false, // Default to used
	listingPrice: 0,
	reservePrice: 0,
	creditCardPayment: false,
	bankTransferPayment: false,
	bitcoinPayment: false,
	pickUp: true, // Default to pick up enabled
	shippingOption: "post", // Default to post
};

export interface Category {
	id: number;
	category_name: string;
	parent_id: number;
	active: boolean;
}
