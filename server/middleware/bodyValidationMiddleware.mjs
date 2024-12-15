/**
 * Middleware to validate the request body against a given schema.
 *
 * @param {Object} schema - The validation schema object.
 * @returns {Function} Middleware function to validate the request body.
 */
const bodyValidationMiddleware = (schema) => {
	return (req, res, next) => {
		const { error } = schema.validate(req.body);

		if (error) {
			const { details } = error;
			const message = details.map((detail) => detail.message).join(",");

			res.status(200).json({ message });
		} else {
			next();
		}
	};
};

export default bodyValidationMiddleware;
