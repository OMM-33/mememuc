<script>
	import { createEventDispatcher } from "svelte";

	import Overlay from "../../Overlay.svelte";
	import Tabs from "../../Tabs.svelte";
	import Error from "../../Error.svelte";

	import Local from "./Local.svelte";
	import URL from "./URL.svelte";
	import ImgFlip from "./ImgFlip.svelte";
	import Camera from "./Camera.svelte";
	import Draw from "./Draw.svelte";

	const dispatch = createEventDispatcher();

	export let open = false;

	let error = null;

	// Apparently we cannot capture events on dynamic components,
	// so we will have to use callback function props:
	const onNew = detail => dispatch("new", detail);
	const onError = detail => error = detail;
	const tabs = [
		{ title: "Local File", component: Local },
		{ title: "URL", component: URL },
		{ title: "ImgFlip", component: ImgFlip },
		{ title: "Camera", component: Camera },
		{ title: "Drawing", component: Draw },
	].map(tabData => ({ ...tabData, props: { ...tabData.props, onNew, onError } }));

	$: if (!open) error = null;
</script>

<Overlay bind:open>
	<div class="upload">
		<Tabs {tabs} on:change={() => error = null} />
		<Error {error} />
	</div>
</Overlay>

<style>
	.upload {
		background-color: var(--c-white);
		width: min(800px, 90vw);
		height: min(800px, 80vh);
		padding: 1em;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.upload :global(> *:first-child) {
		flex-grow: 1;
	}
</style>
