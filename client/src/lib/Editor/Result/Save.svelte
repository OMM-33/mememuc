<script>
	import { onDestroy, onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { getUID, compressImage } from "../../../util";

	import { privacyLevels } from "../../../models/Meme";
	import { memes, resetEditorMeme } from "../../../cache";
	import Button from "../../Button.svelte";
	import Card from "../../Card.svelte";
	import Footer from "./Footer.svelte";
	import Loading from "../../Loading.svelte";
	import SpeechInput from "../../SpeechInput.svelte";

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

	const onSave = async () => {
		if ($meme.id) { // Meme is being edited
			try {
				await $meme.patch();
			} catch (error) {
				console.info(error);
			}
		} else { // Meme is new
			await $meme.post();
			$memes.set($meme.id, $meme);
			resetEditorMeme();
		}
		close.func();
		push(`/meme/${$meme.id}`);
	};
</script>

<Card close={back} scroll>
	<h3 slot="header" style:margin="0">Save Meme</h3>
	<div class="content">
		{#if compressed}
			<form on:submit|preventDefault={onSave}>
				<div class="title">
					<h4>Title</h4>
					<div class="row">
						<input type="text" required minlength="8" style:flex-grow="1" bind:value={$meme.title} />
						<SpeechInput bind:value={$meme.title} data-sc="title" />
					</div>
				</div>
				<div class="row" style:flex-grow="3">
					<fieldset style:margin-bottom="auto">
						<legend>Visibility</legend>
						{#each Object.values(privacyLevels) as { id, label, icon }}
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
					<div class="row" style:margin-bottom="0.5em">
						<h4 style:margin-top="auto" style:flex-grow="1">Add a Description</h4>
						<SpeechInput bind:valueAppend={$meme.description} data-sc="title" />
					</div>
					<textarea bind:value={$meme.description} />
				</div>
				<div class="row">
					<Button
						variant="primary"
						style="flex-grow: 1"
						type="submit"
					>
						✔️ Save & Upload
					</Button>
				</div>
			</form>
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

		width: 800px;
		height: 800px;
		max-width: 100%;
		max-height: 100%;
	}

	form {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.row {
		display: flex;
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
