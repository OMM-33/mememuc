<script>
	import { getUID } from "../../util";
	import Transformable from "./Transformable.svelte";

	export let origin;
	export let angle;
	export let size;
	export let options;

	const uid = getUID();

	const fitMap = {
		0: "contain",
		1: "cover",
		2: "fill",
	};
</script>

<Transformable bind:origin bind:angle bind:size {...$$restProps}>
	<img
		tabindex="0"
		src={options.src}
		style:object-fit={fitMap[options.fit]}
		style:--scale-flip={options.flip ? -1 : 1}
	/>
	<svelte:fragment slot="options">
		<input type="text" bind:value={options.src} />
		<select bind:value={options.fit}>
			<option value={0}>contain</option>
			<option value={1}>cover</option>
			<option value={2}>stretch</option>
		</select>
		<div style:display="flex">
			<label for="option-flip-{uid}">flip</label>
			<input type="checkbox" id="option-flip-{uid}" bind:checked={options.flip} />
		</div>
	</svelte:fragment>
</Transformable>

<style lang="postcss">
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scaleX(var(--scale-flip));

		user-select: none;
		pointer-events: none;
	}
</style>
