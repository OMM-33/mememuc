<script>
	import { onDestroy, onMount } from "svelte";
	import { getUID, compressImage } from "../../../util";

	import { privacyLevels } from "../../../models/Meme";
	import { memes } from "../../../stores";
	import Button from "../../Button.svelte";
	import Card from "../../Card.svelte";
	import Footer from "./Footer.svelte";
	import Loading from "../../Loading.svelte";

	export let meme;
	export let back;
	export let close;

	const uid = getUID();

	let uncompressedBlob;
	let compressed = false;

	onMount(async () => {
		let blob = await compressImage($meme.src, 80 * 1000, "image/webp", 0.1);
		if (blob.type !== "image/webp") {
			// Apparently Safari does not support generating WEBP from canvases, so use JPEG as fallback.
			blob = await compressImage($meme.src, 80 * 1000, "image/jpeg", 0.1);
		}
		uncompressedBlob = $meme.blob;
		$meme.updateBlob(blob);
		compressed = true;
	});

	onDestroy(() => {
		uncompressedBlob;
		$meme.updateBlob(uncompressedBlob);
	});
</script>

<Card close={back} scroll>
	<h3 slot="header" style:margin="0">Save Meme</h3>
	<div class="content">
		{#if compressed}
			<div class="title">
				<h4>Title</h4>
				<input type="text" bind:value={$meme.title} />
			</div>
			<div class="row" style:flex-grow="3">
				<fieldset>
					<legend>Visibility</legend>
					{#each privacyLevels as { id, label, icon }}
						<div>
							<label>
								<input
									type="radio"
									name="visibility-{uid}"
									value={id}
									bind:group={$meme.privacy}
								/>
								{icon} {label}
							</label>
						</div>
					{/each}
				</fieldset>
				<img src={$meme.src} />
			</div>
			<div class="description" style:flex-grow="2">
				<h4>Add a Description</h4>
				<textarea bind:value={$meme.description} />
			</div>
			<div class="row">
				<Button
					variant="primary"
					style="flex-grow: 1"
					on:click={() => $memes.push($meme) && close.func()}
				>
					✔️ Save & Upload
				</Button>
				<Button>📲 Share</Button>
			</div>
		{:else}
			<div class="loading">
				<Loading>Compressing Image</Loading>
			</div>
		{/if}
	</div>
	<Footer slot="footer" type={$meme.blob.type} size={$meme.blob.size} />
</Card>

<style>
	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;

		width: 800px;
		height: 800px;
		max-width: 100%;
		max-height: 100%;
	}

	.row {
		display: flex;
		align-items: flex-start;
		gap: 0.5em;
	}

	img {
		width: 0;
		height: 0;
		flex-grow: 1;
		min-height: 100%;
		object-fit: contain;
	}

	legend {
		font-weight: bold;
	}

	h4 {
		margin-bottom: 0.5em;
	}

	.title {
		display: flex;
		flex-direction: column;
	}

	.title input {
		font: inherit;
		font-weight: 600;
	}

	.description {
		display: flex;
		flex-direction: column;
	}

	.description textarea {
		resize: none;
		font: inherit;
		flex-grow: 1;
	}

	.loading {
		margin: auto;
	}
</style>
