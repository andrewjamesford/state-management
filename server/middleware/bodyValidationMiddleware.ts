import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate the request body against a given schema.
 *
 * @param {Object} schema - The validation schema object.
 * @returns {Function} Middleware function to validate the request body.
 */
const bodyValidationMiddleware = (schema: ZodSchema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			// Make a copy of the body for potential transformation
			const body = { ...req.body };

			// Handle date conversion if needed
			if (body.endDate && typeof body.endDate === "string") {
				try {
					// Attempt to convert string to Date object
					body.endDate = new Date(body.endDate);
				} catch (dateError) {
					// If conversion fails, let Zod handle the validation error
				}
			}
			// Handle listingPrice and reservePrice conversion
			if (body.listingPrice && typeof body.listingPrice === "string") {
				// Attempt to convert string to number
				body.listingPrice = Number.parseFloat(body.listingPrice);
			}
			if (body.reservePrice && typeof body.reservePrice === "string") {
				// Attempt to convert string to number
				body.reservePrice = Number.parseFloat(body.reservePrice);
			}

			schema.parse(body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const message = error.errors.map((detail) => detail.message).join(",");
				res.status(400).json({ message });
			} else {
				next(error);
			}
		}
	};
};

export default bodyValidationMiddleware;
