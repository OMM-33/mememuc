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
	#slideshow{
		flex-direction: row;
font-size: 2em;
	}
	#right{

		float:right;
	}
	#left{
		float: left;
	}
	button{
		background-color: transparent;
		border: none;
		text-decoration: none;
		font-size: 1em;
		cursor: pointer;
	}

</style>
