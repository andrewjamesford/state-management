import type { Request, Response, NextFunction } from "express";
import type { Schema, ValidationError } from "joi";

/**
 * Middleware to validate the request body against a given schema.
 *
 * @param {Object} schema - The validation schema object.
 * @returns {Function} Middleware function to validate the request body.
 */
interface ValidationErrorDetail {
	message: string;
}

interface ValidationResult {
	error?: ValidationError;
}

const bodyValidationMiddleware = (schema: Schema) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const { error }: ValidationResult = schema.validate(req.body);

		if (error) {
			const { details }: { details: ValidationErrorDetail[] } = error;
			const message = details.map((detail) => detail.message).join(",");

			res.status(200).json({ message });
		} else {
			next();
		}
	};
};

export default bodyValidationMiddleware;
