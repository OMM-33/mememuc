<script>
	import Button from "../Button.svelte";
	import Text from "./Text.svelte";
	import Image from "./Image.svelte";

	import html2canvas from "html2canvas";
	import { createEventDispatcher } from "svelte";
	import { arrayMove } from "../../util";

	const dispatch = createEventDispatcher();

	let canvasEl;
	const canvasSize = [null, null];
	let selectedLayerID = null;

	export const meme = {
		background: "https://i.imgur.com/Yu7x5MV.jpeg",
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
		const canvas = await html2canvas(canvasEl, { useCORS: true, logging: true, scale: 1 });
		dispatch("render", {
			dataURL: canvas.toDataURL("png"),
		});
	};
</script>

<div class="editor" resize>
	<div
		class="canvas"
		bind:this={canvasEl}
		bind:clientWidth={canvasSize[0]}
		bind:clientHeight={canvasSize[1]}
	>
		<img src={meme.background} />
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
</div>
<Button on:click={() => addLayer("text")}>📝 Add Textfield</Button>
<Button on:click={() => addLayer("image")}>🖼️ Add Image</Button>
<Button on:click={clear}>❌ Clear Canvas</Button>
<Button on:click={render}>🧮 Render</Button>

<style>
	.editor {
		border: 1px solid black;
		min-height: 480px;
		min-width: 640px;

		display: flex;
		justify-content: center;

		user-select: none;
	}

	.canvas {
		position: relative;
		margin: calc(var(--overflow-margin) * -1);
	}

	img {
		display: block;
		width: 100%;
		height: 100%;
		user-select: none;
		pointer-events: none;
	}
</style>
