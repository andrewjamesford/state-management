import type { Request, Response, NextFunction } from "express";
import type { Schema, ValidationError } from "joi";

/**
 * Middleware to validate query parameters against a given schema.
 *
 * @param {Object} schema - The validation schema.
 * @returns {Function} Middleware function to validate query parameters.
 */
interface ValidationErrorDetail {
	message: string;
}

interface ValidationResult {
	error?: ValidationError;
}

const queryParamValidationMiddleware =
	(schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
		const { error }: ValidationResult = schema.validate(req.query);

		if (error) {
			const { details }: { details: ValidationErrorDetail[] } = error;
			const message = details.map((detail) => detail.message).join(",");

			res.status(200).json({ message });
		} else {
			next();
		}
	};

export default queryParamValidationMiddleware;
