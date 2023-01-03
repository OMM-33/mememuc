<script>
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let isFirst;
	export let isLast;
</script>

|
<button on:click={() => dispatch("moveZ", 1)} disabled={isLast}>
	🔼
</button>
<button on:click={() => dispatch("moveZ", -1)} disabled={isFirst}>
	🔽
</button>
<button on:click={() => dispatch("duplicate")}>
	📋
</button>
<button on:click={() => dispatch("delete")}>
	🗑️
</button>
