<script>
	import { createEventDispatcher } from "svelte";
	import Button from "../Button.svelte";

	const dispatch = createEventDispatcher();

	export let isFirst;
	export let isLast;
</script>

|
<Button on:click={() => dispatch("moveZ", 1)} disabled={isLast}>
	<span class:disabled={isLast}>🔼</span>
</Button>
<Button on:click={() => dispatch("moveZ", -1)} disabled={isFirst}>
	<span class:disabled={isFirst}>🔽</span>
</Button>
<Button on:click={() => dispatch("duplicate")}>
	<span>📋</span>
</Button>
<Button on:click={() => dispatch("delete")}>
	<span>🗑️</span>
</Button>

<style>
	.disabled {
		filter: grayscale(1) brightness(1.5);
	}
</style>
