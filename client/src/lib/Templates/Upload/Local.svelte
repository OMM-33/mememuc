<script>
	import { getImageDimensions } from "../../../util";
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
		/** @type {File} */
		// eslint-disable-next-line svelte/no-dom-manipulating
		const file = inputEl.files[0];
		try {
			const tempURL = URL.createObjectURL(file);
			const dimensions = await getImageDimensions(tempURL);
			URL.revokeObjectURL(tempURL);

			if (dimensions[0] < 1 || dimensions[1] < 1) {
				onError("Image has no pixel data.");
				return;
			}
			onNew({ blob: file, width: dimensions[0], height: dimensions[1] });
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
