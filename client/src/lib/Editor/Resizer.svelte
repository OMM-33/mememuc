<script>
	import { onDestroy, createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	let cursorPos = [null, null];

	const onPointerdown = ({ clientX, clientY }) => {
		window.addEventListener("pointermove", onPointermove);
		cursorPos = [clientX, clientY];
	};
	const onPointerup = () => {
		window.removeEventListener("pointermove", onPointermove);
	};
	const onPointermove = ({ clientX, clientY }) => {
		dispatch("resize", [clientX - cursorPos[0], clientY - cursorPos[1]]);
		cursorPos = [clientX, clientY];
	};
	onDestroy(() => {
		window.removeEventListener("pointermove", onPointermove);
	});
</script>

<div
	class="resizer"
	on:pointerdown={onPointerdown}
/>
<svelte:window on:pointerup={onPointerup} />

<style>
	.resizer {
		position: absolute;
		bottom: 0;
		right: 0;
		width: 1em;
		height: 1em;
		border: 1em solid var(--c-accent);
		border-top-color: transparent;
		border-left-color: transparent;

		pointer-events: auto;
		cursor: nwse-resize;
	}
</style>
