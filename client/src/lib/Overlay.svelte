<script>
	import { onDestroy } from "svelte";
	import { quadInOut } from "svelte/easing";
	import { fade } from "svelte/transition";

	export let open = false;
	export let backgroundclose = false;

	$: if (open) {
		document.addEventListener("keydown", onKeydown);
	} else {
		document.removeEventListener("keydown", onKeydown);
	}
	onDestroy(() => {
		document.removeEventListener("keydown", onKeydown);
	});

	const onKeydown = ({ code }) => {
		if (code === "Escape") open = false;
	};
</script>

{#if open}
	<div
		class="overlay"
		transition:fade={{ duration: 300, easing: quadInOut }}
		on:click|self={() => open = !backgroundclose}
	>
		<div class="overlay-content">
			<slot />
		</div>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.75);
		padding: 1em;

		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 100;
	}

	.overlay-content {
		width: 100%;
		height: 100%;
		pointer-events: none;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.overlay-content :global(> *) {
		pointer-events: auto;
	}
</style>
