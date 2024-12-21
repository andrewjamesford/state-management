import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'


export default defineConfig({
  plugins: [TanStackRouterVite(),viteReact()],
  resolve: {
    alias: {
			"~": path.resolve(__dirname, "./src"),
    },
  },
});
