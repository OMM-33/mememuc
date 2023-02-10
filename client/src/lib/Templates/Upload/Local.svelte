<script>
	import { fileToDataURL, getImageDimensions } from "../../../util";
	import Button from "../../Button.svelte";

	export let onNew, onError;

	let inputEl;
	let uploadAvailable = false;

	const onInputChange = () => {
		// Linter doesn't like access to the file object at all due to it potentially modifying the DOM:
		// eslint-disable-next-line svelte/no-dom-manipulating
		uploadAvailable = (inputEl.files.length === 1);
	};

	const onUpload = async () => {
		// eslint-disable-next-line svelte/no-dom-manipulating
		const file = inputEl.files[0];
		try {
			const src = await fileToDataURL(file);
			const dimensions = await getImageDimensions(src);
			if (dimensions[0] < 1 || dimensions[1] < 1) {
				onError("Image has no pixel data.");
				return;
			}
			onNew({ src });
		} catch (error) {
			onError("Invalid image.");
		}
	};
</script>

<div class="local">
	<input
		bind:this={inputEl}
		type="file"
		accept="image/png, image/jpeg"
		on:change={onInputChange}
	/>
	<Button on:click={onUpload} disabled={!uploadAvailable}>Upload</Button>
</div>

<style>
	.local {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
</style>
