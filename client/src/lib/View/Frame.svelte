<script>
	import Button from "../Button.svelte";
	import Card from "../Card.svelte";

	export let meme;
</script>

<Card>
	<a href="#/meme/{$meme.id}">
		<h3 class="title">{$meme.title}</h3>
		<img src={$meme.src} />
	</a>
	<div class="info">
		<Button
			variant={$meme.vote === 1 && "primary"}
			on:click={() => $meme.toggleVote(1)}
		>
			❤️ {$meme.score}
		</Button>
		<!-- Let's abuse the button component for consistent looks... :) -->
		<Button element="div" variant="noninteractive">
			👁️ {$meme.views}
		</Button>
		<Button element="div" variant="noninteractive">
			🗨️ {$meme.comments.length}
		</Button>
	</div>
</Card>

<style>
	.info {
		display: flex;
		justify-content: space-evenly;
		margin-top: 1em;
	}

	img {
		display: block;
		width: 100%;
		height: 32vh;
		object-fit: contain;
	}

	h3 {
		text-align: center;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
