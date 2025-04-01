import { z } from "zod";

// Schema for adding/updating a listing
export const listingSchema = z.object({
	id: z.number().optional(),
	title: z.string(),
	subTitle: z.string().optional(),
	categoryId: z.number().gt(0),
	subCategoryId: z.number().optional(),
	endDate: z.date().refine(date => date > new Date(), {
		message: "End date must be in the future"
	}),
	description: z.string(),
	condition: z.boolean(),
	listingPrice: z.string(),
	reservePrice: z.string().optional(),
	creditCardPayment: z.boolean(),
	bankTransferPayment: z.boolean(),
	bitcoinPayment: z.boolean(),
	pickUp: z.boolean(),
	shippingOption: z.string(),
}).refine(
	(data) => {
		return data.creditCardPayment === true || 
			   data.bankTransferPayment === true || 
			   data.bitcoinPayment === true;
	},
	{
		message: "At least one of the payment methods must be selected",
		path: ["creditCardPayment"]
	}
);
