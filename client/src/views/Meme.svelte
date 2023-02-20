<script>
	import { push } from "svelte-spa-router";
	import { mod } from "../util";
	import { memes } from "../cache";

	import Button from "../lib/Button.svelte";
	import Comment from "../lib/View/Comment.svelte";

	export let params = {};

	$: meme = $memes.get(params.id);

	let commentText;

	function submitComment() {
		$meme.comments.push({ name: "Ines", text: commentText });
		$meme.comments = $meme.comments; // reactivity...
		commentText = "";
	}

	function switchMeme(offset) {
		const targetID = String(mod(Number($meme.id) + offset, $memes.size));
		push(`/meme/${targetID}`);
	}
	function switchMemeRandom() {
		const otherIDs = [...$memes.keys()].filter(id => id !== $meme.id);
		const targetID = otherIDs[Math.floor(Math.random() * otherIDs.length)];
		push(`/meme/${targetID}`);
	}
</script>

<div class="meme">
	<div class="slideshow">
		<Button on:click={() => switchMeme(-1)}>
			<span class="pointing-hand">👈</span>
		</Button>
		<Button on:click={switchMemeRandom}>
			🎲
		</Button>
		<Button on:click={() => switchMeme(1)}>
			<span class="pointing-hand">👉</span>
		</Button>
	</div>

	<div class="content">
		<h1>{$meme.title}</h1>
		<img src={$meme.src} />

		<div class="details">
			<div>Upvotes: {$meme.score}</div>
			<div>Views: {$meme.views}</div>
			<div>Created by: ???</div>
		</div>
		<div class="description">
			{$meme.description}
		</div>
	</div>

	<div class="comment-section">
		<h2>Comments</h2>
		<div class="comments">
			{#each $meme.comments as comment}
				<Comment text={comment.text} name={comment.name} />
			{/each}
		</div>
		<h3>Post a comment</h3>
		<textarea bind:value={commentText} />
		<Button on:click={submitComment}>Post Comment</Button>
	</div>
</div>


<style>
	.slideshow {
		display: flex;
		justify-content: space-between;
		font-size: 1.5em;
	}
	.slideshow .pointing-hand {
		/* This emoji is kind of weirdly aligned... (on Windows at least) */
		vertical-align: 20%;
		line-height: 1;
	}

	.meme {
		display: flex;
		flex-direction: column;
		gap: 2em;
	}
	img {
		display: block;
		width: 100%;
		max-height: 70vh;
		object-fit: contain;
		background-color: #F2F9F2;
		border: 1px solid black;
	}

	.details {
		display: flex;
		gap: 2em;
	}

	.description {
		margin-top: 1em;
	}

	.comments {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	textarea {
		font: inherit;
		resize: none;
		width: 100%;
		height: 8em;
	}
</style>
