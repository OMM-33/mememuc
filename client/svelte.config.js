import preprocess from "svelte-preprocess";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
	// disable a11y warnings for now
	onwarn: (warning, handler) => {
		if (!warning.code.startsWith("a11y-")) handler(warning);
	},
	preprocess: preprocess({
		postcss: {
			configFilePath: join(__dirname, "postcss.config.js"),
		},
	}),
};
