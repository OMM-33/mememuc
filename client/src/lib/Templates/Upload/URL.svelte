<script>
	import { getImageDimensions } from "../../../util";
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
			const blob = await response.blob();
			onNew({ blob, width: dimensions[0], height: dimensions[1] });
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
