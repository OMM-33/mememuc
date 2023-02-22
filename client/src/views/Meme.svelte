<script>
	import { push } from "svelte-spa-router";
	import { mod } from "../util";
	import { memes } from "../cache";
	import Meme from "../models/Meme";

	import Button from "../lib/Button.svelte";
	import Comment from "../lib/View/Comment.svelte";

	export let params = {};

	// We cannot use the $ syntax to auto-subscribe our store, as it may be asynchronously loaded.
	let meme;
	$: (async () => {
		const memeStore = $memes.get(params.id) || await Meme.get({ id: params.id });
		memeStore.subscribe(value => meme = value);
	})();

	let commentText;

	function submitComment() {
		const text = commentText.trim();
		if (text === "") return;

		meme.comments.push({ name: "Ines", text });
		meme.comments = meme.comments; // reactivity...
		commentText = "";
	}

	function switchMeme(offset) {
		const targetID = String(mod(Number(meme.id) + offset, memes.size));
		push(`/meme/${targetID}`);
	}
	function switchMemeRandom() {
		const otherIDs = [...memes.keys()].filter(id => id !== meme.id);
		const targetID = otherIDs[Math.floor(Math.random() * otherIDs.length)];
		push(`/meme/${targetID}`);
	}
</script>

{#if meme}
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
			<h1>{meme.title}</h1>
			<img src={meme.src} />

			<div class="details">
				<div class="score">
					<Button
						variant={meme.vote === 1 && "primary"}
						rounded={["tl", "bl"]}
						on:click={() => meme.toggleVote(1)}
					>
						<span class="vote up">🔼</span>
					</Button>
					<Button element="div" variant="noninteractive" rounded={[]}>
						❤️ Score: {meme.score}
					</Button>
					<Button
						variant={meme.vote === -1 && "primary"}
						rounded={["tr", "br"]}
						on:click={() => meme.toggleVote(-1)}
					>
						<span class="vote down">🔽</span>
					</Button>
				</div>
				<Button element="div" variant="noninteractive">
					👁️ Views: {meme.views}
				</Button>
				<Button element="div" variant="noninteractive" style="margin-left: auto">
					👤 [CREATOR]
				</Button>
				<Button element="div" variant="noninteractive">
					📅 {meme.updateDate.toLocaleDateString("en-GB")}
				</Button>
				<Button on:click={() => push(`/meme/${meme.id}/edit`)}>
					✏️ Edit
				</Button>
			</div>
			<div class="description">
				{meme.description}
			</div>
		</div>

		<div class="comment-section">
			<h2>Comments</h2>
			<div class="comments">
				{#each meme.comments as comment}
					<Comment text={comment.text} name={comment.name} />
				{/each}
			</div>
			<h3>Post a comment</h3>
			<textarea bind:value={commentText} />
			<Button on:click={submitComment}>Post Comment</Button>
		</div>
	</div>
{/if}


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
		padding: 1em 0;
	}

	.score {
		display: flex;
	}

	.vote.up {
		filter: grayscale() sepia(1) saturate(8);
	}
	.vote.down {
		filter: grayscale() sepia(1) saturate(6) hue-rotate(180deg);
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
