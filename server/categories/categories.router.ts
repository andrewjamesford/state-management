import express, {
	type Request,
	type Response,
	type NextFunction,
} from "express";
const router = express.Router();
import { getCategories } from "./categories.repository.js";

// Get all categories
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const parentId = req.query.parentId ? Number(req.query.parentId) : 0;
		const categories = await getCategories(parentId, true);

		return res.status(200).json(categories);
	} catch (err) {
		next(err);
	}
});

export default router;
