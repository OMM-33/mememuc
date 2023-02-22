<script>
	import { memes, localEditorMeme, updateTemplates } from "../cache";
	import Meme from "../models/Meme";

	import Overlay from "../lib/Overlay.svelte";
	import Templates from "../lib/Templates/Templates.svelte";
	import Editor from "../lib/Editor/Editor.svelte";
	import Result from "../lib/Editor/Result/Result.svelte";

	export let params = {};

	// We cannot use the $ syntax to auto-subscribe our store, as it may be asynchronously loaded.
	let meme;
	$: (async () => {
		const memeStore = params.id
			? $memes.get(params.id) || await Meme.get({ id: params.id })
			: localEditorMeme;
		memeStore.subscribe(value => meme = value);
	})();

	let resultOverlayOpen = false;

	const onAddLayer = ({ detail: { media } }) => {
		meme.addLayer("image", { media });
	};

	const onChangeBackground = async ({ detail: { color, media } }) => {
		if (media) {
			([meme.width, meme.height] = await media.dimensions);
			meme.background.media = media;
		} else if (color) {
			meme.background.color = color;
			meme.background.media = null;
		}
	};

	const onRender = ({ detail: { blob } }) => {
		meme.updateBlob(blob);
		resultOverlayOpen = true;
	};

	updateTemplates();
</script>

{#if meme}
	<div class="editor">
		<Editor bind:meme on:render={onRender} />
		<Templates
			on:add-layer={onAddLayer}
			on:change-background={onChangeBackground}
		/>
	</div>

	<Overlay bind:open={resultOverlayOpen} backgroundclose>
		<Result {meme} close={{ func: () => resultOverlayOpen = false }} />
	</Overlay>
{/if}

<style>
	.editor {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
