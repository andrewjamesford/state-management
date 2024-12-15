import express from "express";
const router = express.Router();
import { getCategories } from "./categories.repository.mjs";

// Get all categories
router.get("/", async (req, res, next) => {
	try {
		const parentId = req?.query?.parentId || 0;
		const categories = await getCategories(parentId, true);

		const responseResults = {
			categories,
		};

		return res.json(responseResults);
	} catch (err) {
		next(err);
	}
});

export default router;
