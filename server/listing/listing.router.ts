import express from "express";
import type { Request, Response, NextFunction } from "express";
const router = express.Router();
import bodyValidationMiddleware from "../middleware/bodyValidationMiddleware";
import {
	addListing,
	getListings,
	getListing,
	updateListing,
} from "./listing.repository";

import { listingSchema } from "./listing.schema";

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
			// Changed: use req.body directly
			const listing = req.body;
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
