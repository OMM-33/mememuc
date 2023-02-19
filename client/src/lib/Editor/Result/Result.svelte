<script>
	import Local from "./Local.svelte";
	import Save from "./Save.svelte";

	export let meme;
	export let close;

	let step = 0;
</script>

{#if step === 0}
	<Local {meme} {close} on:save={() => step++} />
{:else if step === 1}
	<Save {meme} {close} back={{ func: () => step--, label: "↩️" }} />
{/if}
