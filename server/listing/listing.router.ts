import express from "express";
import type { Request, Response, NextFunction } from "express";
const router = express.Router();
import bodyValidationMiddleware from "../middleware/bodyValidationMiddleware.js";
import {
	addListing,
	getListings,
	getListing,
	updateListing,
} from "./listing.repository.js";

import { listingSchema } from "./listing.schema.js";
import type { Listing } from "./listing.model.js";

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
		if (!getListingsResponse.length)
			return res.status(404).json({ message: "No listings found" });

		return res.status(200).json(getListingsResponse);
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
			const listingId = Number(req.params.listingId);
			if (Number.isNaN(listingId)) {
				return res.status(404).json({ message: "Listing not found" });
			}

			const listing = await getListing(Number(listingId));
			if (!listing) {
				return res.status(404).json({ message: "Listing not found" });
			}
			return res.json(listing);
		} catch (err) {
			next(err);
		}
	},
);

/**
 * Add a new Listing
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
			const listing: Listing = req.body;
			const addListingResponse = await addListing(listing);
			if (!addListingResponse) {
				return res.status(400).json({ message: "Error adding listing" });
			}

			// If addListingResponse is a number, it indicates the ID of the newly created listing
			if (typeof addListingResponse === "number" && addListingResponse > 0) {
				return res.status(201).json({ id: addListingResponse });
			}
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
			const listing: Listing = req.body;
			const updateListingResponse = await updateListing(listingId, listing);
			if (!updateListingResponse) {
				return res.status(404).json({ message: "Listing not found" });
			}
			return res.json(updateListingResponse);
		} catch (err) {
			console.error(err);
			next(err);
		}
	},
);

export default router;
