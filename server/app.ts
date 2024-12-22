import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import categoriesRouter from "./categories/categories.router";
import listingRouter from "./listing/listing.router";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware";

dotenv.config();
const app = express();

// Middle ware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/categories", categoriesRouter);
app.use("/api/listings", listingRouter);
// Health check API route
app.get("/health", (req, res) => {
	res.status(200).json({ message: "OK" });
});

// Error handling middleware
app.use(errorHandlerMiddleware);

export default app;
