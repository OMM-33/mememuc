import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import svelteConfig from "./svelte.config";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(svelteConfig)],
	server: { host: "0.0.0.0" },
});
