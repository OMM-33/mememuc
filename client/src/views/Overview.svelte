<script>
	import { memes } from "../cache";

	import Frame from "../lib/View/Frame.svelte";
</script>

<h1>Overview </h1>
<div class="grid">
	{#each [...$memes.values()] as $meme}
		<Frame
			id={$meme.id}
			title={$meme.title}
			image={$meme.src}
			upvotes={$meme.score}
			views={$meme.views}
			comments={$meme.commentCount}
		/>
	{/each}
</div>


<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		justify-content: space-between;
	}
</style>
