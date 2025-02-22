import { addDays, format } from "date-fns";

export const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

export interface RawListing {
	id: number;
	title: string;
	subtitle: string;
	categoryid: number;
	subcategoryid: number;
	enddate: string;
	listingdescription: string;
	condition: boolean;
	listingprice: string;
	reserveprice: string;
	creditcardpayment: boolean;
	banktransferpayment: boolean;
	bitcoinpayment: boolean;
	pickup: boolean;
	shippingoption: string;
	category: string;
}

export interface Listing {
	id: number;
	title: string;
	subTitle: string;
	categoryId: number;
	subCategoryId: number;
	endDate: string;
	description: string;
	condition: boolean;
	listingPrice: string;
	reservePrice: string;
	creditCardPayment: boolean;
	bankTransferPayment: boolean;
	bitcoinPayment: boolean;
	pickUp: boolean;
	shippingOption: string;
	category?: string;
}

export interface ListingSchema {
	id: number;
	title: string;
	subTitle: string;
	categoryId: number;
	subCategoryId: number;
	endDate: string;
	description: string;
	condition: boolean;
	listingPrice: string;
	reservePrice: string;
	creditCardPayment: boolean;
	bankTransferPayment: boolean;
	bitcoinPayment: boolean;
	pickUp: boolean;
	shippingOption: string;
}

export const listingSchema: ListingSchema = {
	id: 0,
	title: "",
	categoryId: 0,
	subCategoryId: 0,
	subTitle: "",
	endDate: endDate,
	description: "",
	condition: false,
	listingPrice: "",
	reservePrice: "",
	creditCardPayment: false,
	bankTransferPayment: false,
	bitcoinPayment: false,
	pickUp: true,
	shippingOption: "post",
};

export interface Category {
	id: number;
	category_name: string;
	parent_id: number;
	active: boolean;
}
