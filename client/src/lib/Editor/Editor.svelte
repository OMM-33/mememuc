<script>
	import { createEventDispatcher } from "svelte";
	import html2canvas from "html2canvas";
	import { wait } from "../../util";

	import Button from "../Button.svelte";
	import Text from "./Text.svelte";
	import Image from "./Image.svelte";
	import Resizer from "./Resizer.svelte";

	const dispatch = createEventDispatcher();

	let renderEl;
	const canvasSize = [null, null];
	let selectedLayerID = null;

	export let meme = null;

	const onResize = ({ detail: change }) => {
		$meme.width = Math.max(64, $meme.width + change[0]);
		$meme.height = Math.max(64, $meme.height + change[1]);
	};

	const onLayerDelete = (index) => {
		if (selectedLayerID === $meme.layers[index].id) {
			selectedLayerID = null;
		}
		$meme.deleteLayer(index);
	};

	const render = async () => {
		// Make sure we never have controls on a render:
		selectedLayerID = null;
		await wait(0);

		const canvas = await html2canvas(renderEl, { useCORS: true, logging: false, scale: 1 });
		const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));

		dispatch("render", { blob });
	};
</script>

<div class="controls">
	<Button on:click={() => $meme.addLayer("text")}>📝 Add Text</Button>
	<Button on:click={() => $meme.clear()}>❌ Clear Canvas</Button>
	<Button variant="primary" on:click={render}>🧮 Generate Meme</Button>
</div>
<div class="editor">
	<div
		class="canvas"
		bind:clientWidth={canvasSize[0]}
		bind:clientHeight={canvasSize[1]}
		style:width="{$meme.width}px"
		style:height="{$meme.height}px"
	>
		<div class="render" bind:this={renderEl}>
			<div
				class="background"
				style:background-color={$meme.background.color}
				style:background-image="url('{$meme.background.media?.src}')"
			/>
			{#each $meme.layers as layer, i (layer.id)}
				<svelte:component
					this={{ text: Text, image: Image }[layer.type]}
					bind:origin={layer.origin}
					bind:angle={layer.angle}
					bind:size={layer.size}
					bind:options={layer.options}
					{canvasSize}
					isFirst={i === 0}
					isLast={i === $meme.layers.length - 1}
					isSelected={layer.id === selectedLayerID}
					on:changeselect={({ detail: doSelect }) => selectedLayerID = doSelect ? layer.id : null}
					on:moveZ={({ detail: moveBy }) => $meme.moveLayer(i, moveBy)}
					on:duplicate={() => $meme.duplicateLayer(i)}
					on:delete={() => onLayerDelete(i)}
				/>
			{/each}
		</div>
		<Resizer on:resize={onResize} />
	</div>
</div>

<style>
	.editor {
		height: 0;
		flex-grow: 1;
		overflow: scroll;

		background-color: hsl(var(--c-white-h), var(--c-white-s), calc(var(--c-white-l) + 5%));
		box-shadow: 0 0 1em rgb(0, 0, 0, 0.2);

		user-select: none;
	}

	.canvas {
		position: relative;
		margin: 1em;
		border: 1px solid var(--c-black);
	}

	.render {
		position: absolute;
		inset: 0;
	}

	.background {
		position: absolute;
		inset: 0;
		background-position: center center;
		background-size: cover;
		user-select: none;
		pointer-events: none;
	}

	.controls {
		flex-shrink: 0;

		display: flex;
		gap: 0.5em;
	}
</style>
