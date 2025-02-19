import Joi from "joi";

// Schema for adding/updating a listing
export const listingSchema = Joi.object({
	title: Joi.string().required(),
	subTitle: Joi.string().optional(),
	categoryId: Joi.number().greater(0).required(),
	subCategoryId: Joi.number().optional(),
	endDate: Joi.date().greater("now").required(),
	description: Joi.string().required(),
	condition: Joi.boolean().required(),
	listingPrice: Joi.string().required(),
	reservePrice: Joi.string().optional(),
	creditCardPayment: Joi.boolean().required(),
	bankTransferPayment: Joi.boolean().required(),
	bitcoinPayment: Joi.boolean().required(),
	pickUp: Joi.boolean().required(),
	shippingOption: Joi.string().required(),
}).custom((value) => {
	if (
		value.creditCardPayment === false &&
		value.bankTransferPayment === false &&
		value.bitcoinPayment === false
	) {
		throw new Error("At least one of the payment methods must be selected");
	}
});
