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
}
