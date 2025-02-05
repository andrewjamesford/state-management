import express from "express";
import type { Request, Response, NextFunction } from "express";
const router = express.Router();
import Joi from "joi";
import bodyValidationMiddleware from "../middleware/bodyValidationMiddleware";
import {
	addListing,
	getListings,
	getListing,
	updateListing,
} from "./listing.repository";

import type { ListingDetails } from "./listing.repository";

router.use(express.json());

/**
 * Get all listings
 *
 * @name GET /listings
 * @function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		// Call getListings() to retrieve all listings from the database
		const getListingsResponse = await getListings();

		return res.json(getListingsResponse);
	} catch (err) {
		next(err);
	}
});

/**
 * Get listing by ID
 *
 * @name GET /listing
 * @function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.get(
	"/:listingId",
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const listingId = req.params.listingId;
			if (listingId) {
				const listing = await getListing(Number(listingId));
				return res.json(listing);
			}
			return res.json({ message: "Listing ID is required" });
		} catch (err) {
			next(err);
		}
	},
);

// Schema for adding a new listing
const listingSchema = Joi.object().keys({
	listing: Joi.object({
		titleCategory: Joi.object({
			userId: Joi.string().optional(),
			title: Joi.string().required(),
			subTitle: Joi.string(),
			categoryId: Joi.number().greater(0).required(),
			subCategoryId: Joi.number(),
			endDate: Joi.date().greater("now").required(),
		}).required(),
		itemDetails: Joi.object({
			description: Joi.string().required(),
			condition: Joi.boolean().required(),
		}).required(),
		pricePayment: Joi.object({
			listingPrice: Joi.string().required(),
			reservePrice: Joi.string(),
			creditCardPayment: Joi.boolean().required(),
			bankTransferPayment: Joi.boolean().required(),
			bitcoinPayment: Joi.boolean().required(),
		}).required(),
		shipping: Joi.object({
			pickUp: Joi.boolean().required(),
			shippingOption: Joi.string().required(),
		}).required(),
	})
		.required()
		.custom((value) => {
			if (
				value.pricePayment.creditCardPayment === false &&
				value.pricePayment.bankTransferPayment === false &&
				value.pricePayment.bitcoinPayment === false
			) {
				throw new Error("At least one of the payment methods must be selected");
			}
		}),
});

// const editListingSchema = Joi.object().keys({
// 	titleCategory: Joi.object({
// 		id: Joi.optional(),
// 		userId: Joi.optional(),
// 		title: Joi.string().required(),
// 		subTitle: Joi.string(),
// 		categoryId: Joi.number().greater(0).required(),
// 		subCategoryId: Joi.number(),
// 		endDate: Joi.date().greater("now").required(),
// 	}).required(),
// 	itemDetails: Joi.object({
// 		description: Joi.string().required(),
// 		condition: Joi.boolean().required(),
// 	}).required(),
// 	pricePayment: Joi.object({
// 		listingPrice: Joi.string().required(),
// 		reservePrice: Joi.string(),
// 		creditCardPayment: Joi.boolean().required(),
// 		bankTransferPayment: Joi.boolean().required(),
// 		bitcoinPayment: Joi.boolean().required(),
// 	}).required(),
// 	shipping: Joi.object({
// 		pickUp: Joi.boolean().required(),
// 		shippingOption: Joi.string().required(),
// 	}).required(),
// });

/**
 * Add a new Listing
 *
 * @name POST /listings
 * @function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.post(
	"/",
	bodyValidationMiddleware(listingSchema),
	async (req, res, next) => {
		try {
			const listing = req.body.listing;

			const addListingResponse = await addListing(listing);

			return res.json(addListingResponse);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
);

/**
 * Update an existing listing
 *
 * @name PUT /listings/:listingId
 * @function
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.put(
	"/:listingId",
	bodyValidationMiddleware(listingSchema),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const listingId = Number(req.params.listingId);
			const listing: ListingDetails = req.body;
			const updateListingResponse = await updateListing(listingId, listing);
			return res.json(updateListingResponse);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
);

export default router;
