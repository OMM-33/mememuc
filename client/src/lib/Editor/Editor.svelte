<script>
	import Button from "../Button.svelte";
	import Text from "./Text.svelte";
	import Image from "./Image.svelte";

	import html2canvas from "html2canvas";

	let canvasEl;
	const canvasSize = [null, null];

	const meme = {
		background: "https://i.imgur.com/Yu7x5MV.jpeg",
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
				origin: [0.5, 0.5], angle: 0, size: [0.25, 0.25],
				options: {
					src: "https://i.imgur.com/T8Hhkur.jpeg",
					fit: 0,
					flip: false,
				},
			},
		}[type];
		meme.layers.push({ type, ...layer });
		meme.layers = meme.layers;
	};

	const clear = () => {
		meme.layers = [];
	};

	const render = async () => {
		const canvas = await html2canvas(canvasEl, { useCORS: true, logging: true, scale: 1 });
		const html = `<body style="margin: 0"><iframe style="inset: 0; border: none; width: 100%; height: 100%" src="${canvas.toDataURL("png")}"></iframe></body>`;
		const win = window.open();
		win.document.write(html);
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
		{#each meme.layers as layer}
			<svelte:component
				this={{ text: Text, image: Image }[layer.type]}
				bind:origin={layer.origin}
				bind:angle={layer.angle}
				bind:size={layer.size}
				bind:options={layer.options}
				{canvasSize}
			/>
		{/each}
	</div>
</div>
<Button on:click={() => addLayer("text")}>Add Textfield</Button>
<Button on:click={() => addLayer("image")}>Add Image</Button>
<Button on:click={clear}>Clear</Button>
<Button on:click={render}>Render</Button>

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
		user-select: none;
		pointer-events: none;
	}
</style>
