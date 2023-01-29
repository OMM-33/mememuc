<script>
	import { getUID } from "../../util";
	import Transformable from "./Transformable.svelte";
	import DefaultOptions from "./DefaultOptions.svelte";

	export let origin;
	export let angle;
	export let size;
	export let options;

	export let isFirst;
	export let isLast;

	const uid = getUID();

	const fitMap = {
		0: "contain",
		1: "cover",
		2: "100% 100%",
	};
</script>

<Transformable bind:origin bind:angle bind:size {...$$restProps} on:changeselect>
	<!--
		html2canvas (used for rendering) currently doesn't support object-fit,
		but it supports the similar properties on a CSS background-image:
	-->
	<div
		class="image"
		tabindex="0"
		style:background-image="url('{options.src}')"
		style:background-size={fitMap[options.fit]}
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
		<DefaultOptions on:moveZ on:duplicate on:delete {isFirst} {isLast} />
	</svelte:fragment>
</Transformable>

<style>
	.image {
		width: 100%;
		height: 100%;
		background-position: center;
		background-repeat: no-repeat;
		transform: scaleX(var(--scale-flip));

		user-select: none;
		pointer-events: none;
	}
	.image:focus,
	.image:focus-visible {
		outline: none;
	}
</style>
