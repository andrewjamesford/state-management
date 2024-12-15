/**
 * Middleware to validate query parameters against a given schema.
 *
 * @param {Object} schema - The validation schema.
 * @returns {Function} Middleware function to validate query parameters.
 */
const queryParamValidationMiddleware = (schema) => (req, res, next) => {
	const { error } = schema.validate(req.query);

	if (error) {
		const { details } = error;
		const message = details.map((detail) => detail.message).join(",");

		res.status(200).json({ message });
	} else {
		next();
	}
};

export default queryParamValidationMiddleware;
