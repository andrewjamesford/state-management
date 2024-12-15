import app from "./app.mjs";

const port = process.env.PORT || 5002;
app.listen(port, () => {
	console.log(`Server has started on port ${port}`);
});
