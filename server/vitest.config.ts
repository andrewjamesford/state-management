import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
	test: {
		globals: true,
		environment: "node",
		include: ["**/*.{test,spec}.ts"],
		exclude: ["**/*.js", "**/node_modules/**"],
		coverage: {
			reporter: ["text", "json", "html"],
		},
	},
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./tests"),
		},
	},
});
