import type { Request, Response, NextFunction } from "express";
import { type ZodSchema, ZodError } from "zod";

/**
 * Middleware to validate query parameters against a given schema.
 *
 * @param {Object} schema - The validation schema.
 * @returns {Function} Middleware function to validate query parameters.
 */
const queryParamValidationMiddleware =
	(schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
		try {
			// Make a copy of query params for potential transformation
			const queryParams = { ...req.query };
			
			// Handle date conversion if needed
			if (queryParams && queryParams.endDate && typeof queryParams.endDate === 'string') {
				try {
					// Attempt to convert string to Date object
					// @ts-ignore
					queryParams.endDate = new Date(queryParams.endDate);
				} catch (dateError) {
					// If conversion fails, let Zod handle the validation error
				}
			}
			
			schema.parse(queryParams);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const message = error.errors.map((detail) => detail.message).join(",");
				res.status(200).json({ message });
			} else {
				next(error);
			}
		}
	};

export default queryParamValidationMiddleware;
