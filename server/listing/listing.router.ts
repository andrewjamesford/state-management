import express from "express";
import type { Request, Response, NextFunction } from "express";
const router = express.Router();
import Joi from "joi";
import bodyValidationMiddleware from "../middleware/bodyValidationMiddleware";
import {
	addDraftListing,
	addListing,
	getDraftListing,
	getListings,
	getListing,
	updateDraftListing,
	updateListing,
} from "./listing.repository";

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
 * Get all listings
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
			// Changed to use req.params instead of req.query.
			const listingId = req.params.listingId;
			if (listingId) {
				const getListingResponse = await getListing(Number(listingId));
				return res.json(getListingResponse);
			}
			return res.json({ message: "Listing ID is required" });
		} catch (err) {
			next(err);
		}
	},
);

// schema for adding a new listing
const addListingSchema = Joi.object().keys({
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
	bodyValidationMiddleware(addListingSchema),
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
	bodyValidationMiddleware(addListingSchema),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const listingId = Number(req.params.listingId);
			const listing = req.body.listing;

			const updateListingResponse = await updateListing(listingId, listing);
			return res.json(updateListingResponse);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
);

/**
 * Save draft listing
 *
 * @name POST /listings/:userId
 * @function
 * @param {string} req.params.userId - The userId of the user to save their draft listing for
 * @param {Object} req.body.listing - The draft listing data to be saved
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.post("/:userId", async (req, res, next) => {
	try {
		const userId = req?.params?.userId;
		const draft = req?.body?.listing;

		if (!userId) throw new Error("User ID is required");
		if (!draft) throw new Error("Draft data is required");

		// Call getDraftListing() to check if the user already has a saved listing
		const listings = await getDraftListing(userId);

		if (listings !== null && listings !== undefined && listings.length <= 0) {
			// If no existing listing is found, call addDraftListing() to create a new draft listing for the user
			const addDraftListingResponse = await addDraftListing(draft, userId);

			if (addDraftListingResponse !== null) return res.json(true);
		}
		// If an existing listing is found, call updateDraftListing() to update the draft listing with the new data
		const updateDraftListingResponse = await updateDraftListing(draft, userId);

		if (updateDraftListingResponse !== null) return res.json(true);

		return res.json(false);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

/**
 * Get draft listing by userId address
 *
 * @name GET /listings/:userId
 * @function
 * @param {string} req.params.userId - The userId of the user to get their draft listing from
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
router.get("/:userId", async (req, res, next) => {
	try {
		const userId = req.params.userId;
		const listings = await getDraftListing(userId);
		return res.json(listings);
	} catch (err) {
		console.error(err);
		next(err);
	}
});

export default router;
