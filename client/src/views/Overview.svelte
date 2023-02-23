<script>
	import { memes, updateMemes } from "../cache";

	import Frame from "../lib/View/Frame.svelte";

	updateMemes();

	const memesArray = [];
	$: (async () => {
		const memeStores = [...$memes.values()];
		memeStores.forEach((store, i) => store.subscribe(value => memesArray[i] = value));
	})();

	$: publicMemes = memesArray.filter(({ privacy }) => privacy === "public");
</script>

<h1>Overview </h1>
<div class="grid">
	{#each publicMemes as meme}
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
