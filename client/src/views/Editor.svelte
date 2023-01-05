<script>
	import Editor from "../lib/Editor/Editor.svelte";
	import Overlay from "../lib/Overlay.svelte";

	let resultDataURL = null;
	let resultOverlayOpen = false;
</script>

<h1>Editor</h1>
<Editor
	on:render={({ detail: { dataURL } }) => {
		resultDataURL = dataURL;
		resultOverlayOpen = true;
	}}
/>
<Overlay bind:open={resultOverlayOpen}>
	<img src={resultDataURL} alt="Render Result" />
</Overlay>

<style>
	img {
		display: block;
	}
</style>
