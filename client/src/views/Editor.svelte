<script>
	import Editor from "../lib/Editor/Editor.svelte";
	import Overlay from "../lib/Overlay.svelte";

	let resultDataURL = null;
	let resultOverlayOpen = false;
</script>

<div class="editor">
	<h1>Editor</h1>
	<Editor
		on:render={({ detail: { dataURL } }) => {
			resultDataURL = dataURL;
			resultOverlayOpen = true;
		}}
	/>
</div>

<Overlay bind:open={resultOverlayOpen}>
	<img class="render-result" src={resultDataURL} alt="Render Result" />
</Overlay>

<style>
	.editor {
		flex-grow: 1;

		display: flex;
		flex-direction: column;
	}

	.render-result {
		display: block;
	}
</style>
