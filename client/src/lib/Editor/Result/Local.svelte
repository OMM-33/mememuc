<script>
	import { onDestroy, onMount, createEventDispatcher } from "svelte";
	import { compressImage, mimeToFileType } from "../../../util";
	import Media from "../../../models/Media";

	import Button from "../../Button.svelte";
	import Card from "../../Card.svelte";
	import Footer from "./Footer.svelte";

	export let meme;
	export let close;

	const dispatch = createEventDispatcher();

	const target = { kb: 0, types: ["image/jpeg", "image/webp"], type: "image/jpeg" };
	let compressedMedia = null;

	$: media = compressedMedia || $meme;

	const compress = async () => {
		const bytes = target.kb * 1000;

		const blob = await compressImage($meme.src, bytes, target.type);
		if (compressedMedia) return; // User could click fast... :)
		compressedMedia?.destroy();
		compressedMedia = new Media({ blob });
	};

	const restoreUncompressed = () => {
		compressedMedia = null;
		compressedMedia?.destroy();
	};

	onMount(() => {
		target.kb = Math.ceil(media?.blob.size / 1000 / 8);
	});

	onDestroy(() => {
		compressedMedia?.destroy();
	});
</script>

<Card {close} scroll>
	<h3 slot="header" style:margin="0">Generated Meme</h3>
	<div class="content">
		<img src={media.src} />
		<div class="controls">
			<div class="row">
				<Button variant="primary" style="flex-grow: 1" on:click={() => dispatch("save")}>
					✔️ Save in Profile
				</Button>
			</div>
			<div class="row">
				<div>
					<Button element="a" href={media.src} download="meme">📥 Download</Button>
				</div>
				<div>
					{#if !compressedMedia}
						<Button on:click={compress}>🗜️ Compress</Button>
					{:else}
						<Button on:click={restoreUncompressed}>🗜️ Restore uncompressed</Button>
					{/if}
					<label>
						<input
							type="number"
							size="6"
							min="0"
							max="10000"
							bind:value={target.kb}
						/>
						kB
					</label>
					<label>
						as
						<select bind:value={target.type}>
							{#each target.types as type}
								<option value={type}>{mimeToFileType(type)}</option>
							{/each}
						</select>
					</label>
				</div>
			</div>
		</div>
	</div>
	<Footer slot="footer" type={media.blob.type} size={media.blob.size} />
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

	.controls {
		flex-shrink: 0;

		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	img {
		flex-grow: 1;
		height: 128px;
		object-fit: contain;
	}
</style>
