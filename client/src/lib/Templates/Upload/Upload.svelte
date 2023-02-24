<script>
	import { createEventDispatcher } from "svelte";
	import { templates, getNextLocalTemplateID } from "../../../cache";
	import Media from "../../../models/Media";

	import Overlay from "../../Overlay.svelte";
	import Tabs from "../../Tabs.svelte";
	import ErrorDisplay from "../../Error.svelte";

	import Local from "./Local.svelte";
	import URL from "./URL.svelte";
	import ImgFlip from "./ImgFlip.svelte";
	import Camera from "./Camera.svelte";
	import Draw from "./Draw.svelte";
	import Card from "../../Card.svelte";
	import { user } from "../../../auth";

	export let open = false;

	const dispatch = createEventDispatcher();

	let error = null;

	// Apparently we cannot capture events on dynamic components,
	// so we will have to use callback function props:
	const onError = detail => error = detail;
	const onNew = async (mediaProps) => {
		try {
			const template = new Media(mediaProps);
			if ($user.id) {
				await template.post({ isTemplate: true }); // will populate id and src from server
				$templates.set(template.id, template);
			} else {
				$templates.set(getNextLocalTemplateID(), template);
			}
			$templates = $templates;
			dispatch("new", template);
		} catch (error) {
			onError(error.message);
		}
	};
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
	<Card close={{ func: () => open = false }}>
		<h3 slot="header" style:margin="0">Add a template</h3>
		<div class="upload">
			<Tabs {tabs} on:change={() => error = null} />
			<ErrorDisplay {error} />
		</div>
	</Card>
</Overlay>

<style>
	.upload {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

		height: 800px;
		width: 800px;
		max-width: 100%;
		max-height: 100%;
	}

	.upload :global(> *:first-child) {
		flex-grow: 1;
	}
</style>
