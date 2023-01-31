<script>
	import { getImageDimensions } from "../util";
	import Meme from "../models/Meme";

	import MemeTemplates from "../lib/MemeTemplates.svelte";
	import Editor from "../lib/Editor/Editor.svelte";
	import Overlay from "../lib/Overlay.svelte";

	let resultDataURL = null;
	let resultOverlayOpen = false;

	let meme = new Meme();

	const onChangeBackground = async ({ detail: background }) => {
		if (background.image) {
			$meme.size = await getImageDimensions(background.image);
			$meme.background.image = background.image;
		} else if (background.color) {
			$meme.background.color = background.color;
			$meme.background.image = null;
		}
	};

	const onRender = ({ detail: { dataURL } }) => {
		resultDataURL = dataURL;
		resultOverlayOpen = true;
	};
</script>

<div class="editor">
	<MemeTemplates
		on:add-image={({ detail: background }) => $meme.addLayer("image", { src: background.image })}
		on:change-background={onChangeBackground}
	/>
	<Editor bind:meme on:render={onRender} />
</div>

<Overlay bind:open={resultOverlayOpen}>
	<img class="render-result" src={resultDataURL} alt="Render Result" />
</Overlay>

<style>
	.editor {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.render-result {
		display: block;
	}
</style>
