import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import categoriesRouter from "./categories/categories.router.mjs";
import listingRouter from "./listing/listing.router.mjs";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.mjs";

dotenv.config();
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/categories", categoriesRouter);
app.use("/api/listings", listingRouter);
// Health check API route
app.get("/health", (req, res) => {
	res.status(200).json({ message: "OK" });
});

// error handling middleware
app.use(errorHandlerMiddleware);

export default app;
