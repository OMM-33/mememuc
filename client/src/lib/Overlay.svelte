<script>
	import { quadInOut } from "svelte/easing";
	import { fade } from "svelte/transition";

	export let open = false;
</script>

{#if open}
	<div
		class="overlay"
		transition:fade={{ duration: 300, easing: quadInOut }}
		on:click|self={() => open = false}
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
		display: grid;
		place-content: center;
	}
</style>
