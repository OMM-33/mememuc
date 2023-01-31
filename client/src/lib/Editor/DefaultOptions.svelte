<script>
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let isFirst;
	export let isLast;
</script>

|
<button on:click={() => dispatch("moveZ", 1)} disabled={isLast}>
	<span>🔼</span>
</button>
<button on:click={() => dispatch("moveZ", -1)} disabled={isFirst}>
	<span>🔽</span>
</button>
<button on:click={() => dispatch("duplicate")}>
	<span>📋</span>
</button>
<button on:click={() => dispatch("delete")}>
	<span>🗑️</span>
</button>

<style>
	button:disabled span {
		filter: grayscale(1) brightness(1.5);
	}
</style>
