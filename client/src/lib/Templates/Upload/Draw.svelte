<script>
	import { onDestroy, onMount } from "svelte";
	import Button from "../../Button.svelte";

	export let onNew, onError;

	let width, height;
	let canvasEl;
	let context;
	let canvasOrigin = [null, null];

	const onSave = () => {
		const src = canvasEl.toDataURL("image/png");
		onNew({ src });
	};

	const onPointerdown = ({ clientX, clientY }) => {
		canvasEl.addEventListener("pointermove", onPointermove);

		const rect = canvasEl.getBoundingClientRect();
		const { left, top } = rect;
		// eslint-disable-next-line svelte/no-dom-manipulating
		canvasOrigin = [Math.floor(left + canvasEl.clientLeft), Math.floor(top + canvasEl.clientTop)];

		context.lineCap = "round";
		context.lineJoin = "round";
		context.lineWidth = 8;
		context.beginPath();
		context.moveTo(clientX - canvasOrigin[0], clientY - canvasOrigin[1]);
		onPointermove({ clientX, clientY });
	};
	const onPointermove = ({ clientX, clientY }) => {
		context.lineTo(clientX - canvasOrigin[0], clientY - canvasOrigin[1]);
		context.stroke();
	};
	const onPointerup = () => {
		context.closePath();
		canvasEl.removeEventListener("pointermove", onPointermove);
	};

	onMount(() => {
		context = canvasEl.getContext("2d");
	});
	onDestroy(() => {
		canvasEl.removeEventListener("pointermove", onPointermove);
	});
</script>

<div class="draw">
	<canvas
		bind:this={canvasEl}
		bind:clientWidth={width}
		bind:clientHeight={height}
		{width}
		{height}
		on:pointerdown={onPointerdown}
	/>
	<Button on:click={onSave}>Use drawing</Button>
</div>

<svelte:window on:pointerup={onPointerup} />

<style>
	.draw {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	canvas {
		height: 0;
		flex-grow: 1;
		border: 1px solid black;
	}
</style>
