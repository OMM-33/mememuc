<script>
	import Meme from "../models/Meme";

	import Overlay from "../lib/Overlay.svelte";
	import Templates from "../lib/Templates/Templates.svelte";
	import Editor from "../lib/Editor/Editor.svelte";
	import RenderResult from "../lib/Editor/RenderResult.svelte";

	let resultOverlayOpen = false;

	let meme = new Meme();

	const onAddLayer = ({ detail: { media } }) => {
		$meme.addLayer("image", { media });
	};

	const onChangeBackground = async ({ detail: { color, media } }) => {
		if (media) {
			([$meme.width, $meme.height] = await media.dimensions);
			$meme.background.media = media;
		} else if (color) {
			$meme.background.color = color;
			$meme.background.media = null;
		}
	};

	const onRender = ({ detail: { blob } }) => {
		$meme.updateBlob(blob);
		resultOverlayOpen = true;
	};
</script>

<div class="editor">
	<Editor bind:meme on:render={onRender} />
	<Templates
		on:add-layer={onAddLayer}
		on:change-background={onChangeBackground}
	/>
</div>

<Overlay bind:open={resultOverlayOpen} backgroundclose>
	<RenderResult {meme} close={() => resultOverlayOpen = false} />
</Overlay>

<style>
	.editor {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		gap: 1em;
	}
</style>
