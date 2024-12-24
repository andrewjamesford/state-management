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
		const categories = await getCategories(0, true);

		return res.status(200).json(categories.rows);
	} catch (err) {
		next(err);
	}
});

export default router;
