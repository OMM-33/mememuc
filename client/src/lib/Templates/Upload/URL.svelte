<script>
	import { fileToDataURL, getImageDimensions } from "../../../util";
	import Button from "../../Button.svelte";

	export let onNew, onError;

	let url = "";

	const onUpload = async () => {
		try {
			const dimensions = await getImageDimensions(url);
			if (dimensions[0] < 1 || dimensions[1] < 1) {
				onError("Image has no pixel data.");
				return;
			}
			const response = await fetch(url);
			const file = await response.blob();
			const src = await fileToDataURL(file);
			onNew({ src });
		} catch (error) {
			onError(error.type ? "Invalid image." : error);
		}
	};
</script>

<div class="url">
	<input type="url" placeholder="Image address in the web" bind:value={url} />
	<Button on:click={onUpload} disabled={url.length < 1}>Upload</Button>
</div>

<style>
	.url {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
</style>
