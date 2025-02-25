/// <reference types="vitest" />
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from 'url';

export default defineConfig({
	plugins: [TanStackRouterVite(), viteReact()],
	resolve: {
		alias: {
			"~": fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/tests/setup.ts'],
		globals: true,
		css: true,
	},
});
