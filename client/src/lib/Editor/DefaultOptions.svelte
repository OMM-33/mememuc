<script>
	import { createEventDispatcher } from "svelte";
	import Button from "../Button.svelte";

	const dispatch = createEventDispatcher();

	export let isFirst;
	export let isLast;
</script>

|
<Button on:click={() => dispatch("moveZ", 1)} disabled={isLast} padding="0.25em">
	<span class:disabled={isLast}>🔼</span>
</Button>
<Button on:click={() => dispatch("moveZ", -1)} disabled={isFirst} padding="0.25em">
	<span class:disabled={isFirst}>🔽</span>
</Button>
<Button on:click={() => dispatch("duplicate")} padding="0.25em">
	<span>📋</span>
</Button>
<Button on:click={() => dispatch("delete")} padding="0.25em">
	<span>🗑️</span>
</Button>

<style>
	.disabled {
		filter: grayscale(1) brightness(1.5);
	}
</style>
