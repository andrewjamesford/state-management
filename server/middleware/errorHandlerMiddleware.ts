/**
 * Middleware function to handle errors in the application.
 *
 * @param {Object} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
interface Error {
	status?: number;
	message: string;
}

interface Request {
	// Define properties of the request object as needed
}

interface Response {
	status: (code: number) => Response;
	json: (body: any) => void;
}

interface NextFunction {
	(): void;
}

export default function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
	res.status(err.status || 500).json({
		message: err.message,
	});
}
