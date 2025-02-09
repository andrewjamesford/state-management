export interface ListingResponse {
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

export interface ListingState {
	titleCategory: {
		title: string;
		subTitle: string;
		categoryId: number;
		subCategoryId: number;
		endDate: string;
	};
	itemDetails: {
		condition: boolean;
		description: string;
	};
	pricePayment: {
		listingPrice: number;
		reservePrice: number;
		creditCardPayment: boolean;
		bankTransferPayment: boolean;
		bitcoinPayment: boolean;
	};
	shipping: {
		pickUp: boolean;
		shippingOption: string;
	};
}
