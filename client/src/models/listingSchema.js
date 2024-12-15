import { addDays, format } from "date-fns";
export const endDate = format(addDays(new Date(), 1), "yyyy-MM-dd");

// Define the schema for the listing form data object
export const listingSchema = {
	titleCategory: {
		userId: "",
		title: "",
		categoryId: 0,
		subCategoryId: 0,
		subTitle: "",
		endDate: endDate,
	},
	itemDetails: {
		description: "",
		condition: false,
	},
	pricePayment: {
		listingPrice: "",
		reservePrice: "",
		creditCardPayment: false,
		bankTransferPayment: false,
		bitcoinPayment: false,
	},
	shipping: {
		pickUp: true,
		shippingOption: "post",
	},
};
