<script>
	import { memes } from "../cache";

	import Frame from "../lib/View/Frame.svelte";
</script>

<h1>Overview </h1>
<div class="grid">
	{#each [...$memes.values()] as meme}
		<Frame {meme} />
	{/each}
</div>


<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		justify-content: space-between;
		row-gap: 4em;
		column-gap: 1em;
	}
</style>
