export interface Listing {
	id: number;
	title: string;
	subTitle: string;
	categoryId: number;
	subCategoryId: number;
	endDate: string;
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
