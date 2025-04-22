export interface ApiError {
	message: string;
	status?: number;
	// Add other potential error details if needed
	details?: any;
}

// The server repository already returns camelCase, making RawListing redundant
// export interface RawListing {
// 	id: number;
// 	title: string;
// 	subtitle: string;
// 	categoryid: number; // This seems to be the subcategory ID based on server queries
// 	subcategoryid: number; // This seems redundant based on server queries
// 	enddate: string;
// 	listingdescription: string;
// 	condition: boolean;
// 	listingprice: string; // Server returns number/numeric, client expects number
// 	reserveprice: string; // Server returns number/numeric, client expects number
// 	creditcardpayment: boolean;
// 	banktransferpayment: boolean;
// 	bitcoinpayment: boolean;
// 	pickup: boolean;
// 	shippingoption: string;
// 	category: string; // This is the subcategory name based on server queries
// }

// This interface reflects the camelCase structure returned by the server repository
export interface Listing {
	id: number;
	title: string;
	subTitle: string;
	// Based on server queries, categoryId is the parent category ID
	categoryId: number;
	// Based on server queries, subCategoryId is the actual category ID stored in listings.category_id
	subCategoryId: number;
	endDate: string; // Server returns string (date format)
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

// This interface is specifically for the form state, handling Date objects and numbers
export interface ListingSchema {
	id: number;
	title: string;
	subTitle: string;
	categoryId: number; // Parent category ID
	subCategoryId: number; // Sub category ID
	endDate: Date; // Client form uses Date object
	description: string;
	condition: boolean;
	listingPrice: number;
	reservePrice: number;
	creditCardPayment: boolean;
	bankTransferPayment: boolean;
	bitcoinPayment: boolean;
	pickUp: boolean;
	shippingOption: string;
}

export const listingSchema: ListingSchema = {
	id: 0,
	title: "",
	categoryId: 0, // Default to no parent category selected
	subCategoryId: 0, // Default to no subcategory selected
	subTitle: "",
	endDate: new Date(), // Default to current date, will be updated by form logic
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
