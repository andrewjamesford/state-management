import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
const router = express.Router();
import { getCategories } from "./categories.repository";
import type { QueryResult } from "pg";

// Get all categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log("categories 1", "--");
		const categories = await getCategories(0, true);
		console.log("categories 2", categories);

		return res.status(200).json(categories);
	} catch (err) {
		next(err);
	}
});

export default router;
