/**
 * Middleware function to handle errors in the application.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export default function errorHandlerMiddleware(err, req, res, next) {
	res.status(err.status || 500).json({
		message: err.message,
	});
}
