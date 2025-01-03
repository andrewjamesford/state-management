import { config } from "dotenv";
import app from "./app";

config();

const port: number = Number.parseInt(process.env.PORT || "5002", 10);

app.listen(port, () => {
	console.log(`Server has started on port ${port}`);
});
