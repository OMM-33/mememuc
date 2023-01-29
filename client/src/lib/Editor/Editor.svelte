<script>
	import Button from "../Button.svelte";
	import Text from "./Text.svelte";
	import Image from "./Image.svelte";
	import Resizer from "./Resizer.svelte";

	import html2canvas from "html2canvas";
	import { createEventDispatcher } from "svelte";
	import { arrayMove } from "../../util";

	const dispatch = createEventDispatcher();

	let renderEl;
	const canvasSize = [null, null];
	let selectedLayerID = null;

	export const meme = {
		background: "https://i.imgur.com/Yu7x5MV.jpeg",
		size: [640, 853],
		nextLayerID: 0,
		layers: [],
	};

	const addLayer = (type) => {
		const layer = {
			text: {
				origin: [0.5, 0.5], angle: 0, size: [0.5, 0.25],
				options: {
					text: "[text]",
					font: { size: 64, color: "#ffffff", colorStroke: "#000000", align: 1 },
				},
			},
			image: {
				origin: [0.5, 0.5], angle: 0, size: [0.33, 0.33],
				options: {
					src: "https://i.imgur.com/T8Hhkur.jpeg",
					fit: 0,
					flip: false,
				},
			},
		}[type];
		meme.layers.push({ id: meme.nextLayerID++, type, ...layer });
		meme.layers = meme.layers;
	};

	const onResize = ({ detail: change }) => {
		meme.size = meme.size.map((coord, i) => Math.max(64, coord + change[i]));
	};

	const moveLayer = (index, moveBy) => {
		const newIndex = index + moveBy;
		if (newIndex < 0 || newIndex >= meme.layers.length) return;

		arrayMove(meme.layers, index, newIndex);
		meme.layers = meme.layers;
	};

	const deleteLayer = (index) => {
		meme.layers.splice(index, 1);
		meme.layers = meme.layers;
		meme.nextLayerID--;
	};

	const duplicateLayer = (index) => {
		// Deep clone layer using JSON parsing for now...
		const layer = { ...JSON.parse(JSON.stringify(meme.layers[index])), id: meme.nextLayerID++ };
		meme.layers.push(layer);
		meme.layers = meme.layers;
	};

	const clear = () => {
		meme.layers = [];
	};

	const render = async () => {
		selectedLayerID = null; // just to make sure we never have controls on a render
		const canvas = await html2canvas(renderEl, { useCORS: true, logging: true, scale: 1 });
		dispatch("render", {
			dataURL: canvas.toDataURL("png"),
		});
	};
</script>

<div class="editor" resize>
	<div
		class="canvas"
		bind:clientWidth={canvasSize[0]}
		bind:clientHeight={canvasSize[1]}
		style:width="{meme.size[0]}px"
		style:height="{meme.size[1]}px"
	>
		<div class="render" bind:this={renderEl}>
			<div class="background" style:background-image="url('{meme.background}')" />
			{#each meme.layers as layer, i (layer.id)}
				<svelte:component
					this={{ text: Text, image: Image }[layer.type]}
					bind:origin={layer.origin}
					bind:angle={layer.angle}
					bind:size={layer.size}
					bind:options={layer.options}
					{canvasSize}
					isFirst={i === 0}
					isLast={i === meme.layers.length - 1}
					isSelected={layer.id === selectedLayerID}
					on:changeselect={({ detail: doSelect }) => selectedLayerID = doSelect ? layer.id : null}
					on:moveZ={({ detail: moveBy }) => moveLayer(i, moveBy)}
					on:duplicate={() => duplicateLayer(i)}
					on:delete={() => deleteLayer(i)}
				/>
			{/each}
		</div>
		<Resizer on:resize={onResize} />
	</div>
</div>
<div class="controls">
	<Button on:click={() => addLayer("text")}>📝 Add Textfield</Button>
	<Button on:click={() => addLayer("image")}>🖼️ Add Image</Button>
	<Button on:click={clear}>❌ Clear Canvas</Button>
	<Button on:click={render}>🧮 Render</Button>
</div>

<style>
	.editor {
		height: 0;
		flex-grow: 1;
		overflow: scroll;

		background-color: var(--c-white-light);
		box-shadow: 0 0 1em rgb(0, 0, 0, 0.2);

		user-select: none;
	}

	.canvas {
		position: relative;
		margin: 1em;
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
		margin-top: 1em;
	}
</style>
