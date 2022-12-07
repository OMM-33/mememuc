import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte({
		// disable a11y warnings for now
		onwarn: (warning, handler) => {
			if (!warning.code.startsWith("a11y-")) handler(warning);
		},
	})],
	server: { host: "0.0.0.0" },
});
