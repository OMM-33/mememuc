<script>
	import { push } from "svelte-spa-router";
	import { mod } from "../util";
	import { tts } from "../speech";
	import { memes, updateMemes } from "../cache";
	import Meme from "../models/Meme";

	import Button from "../lib/Button.svelte";
	import Comment from "../lib/View/Comment.svelte";
	import Graph from "../lib/Graph.svelte";

	export let params = {};

	// We need the other memes for the statistics, but cached should be fine.
	// So fetch only if the cache is empty:
	if ($memes.size === 0) {
		updateMemes();
	}

	// We cannot use the $ syntax to auto-subscribe our store, as it may be asynchronously loaded.
	let meme;
	$: (async () => {
		const memeStore = $memes.get(params.id) || await Meme.get({ id: params.id });
		memeStore.subscribe(value => meme = value);
	})();

	const shareText = "📲 Share";
	let shareButtonText = shareText;
	let shareButtonTextTimeout = NaN;

	function share() {
		clearTimeout(shareButtonTextTimeout);
		navigator.clipboard.writeText(location.href)
			.then(() => shareButtonText = "✔️ Link copied")
			.catch(() => "❌ Copying link failed");
		shareButtonTextTimeout = setTimeout(() => shareButtonText = shareText, 2000);
	}

	let commentText;

	function submitComment() {
		const text = commentText.trim();
		if (text === "") return;

		meme.addComment(commentText);
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

	let memesArray = [];
	$: {
		const result = [];
		const memeStores = [...$memes.values()];
		memeStores.forEach((store, i) => store.subscribe(value => result[i] = value));
		memesArray = result;
	}

	$: publicMemes = memesArray.filter(({ privacy }) => privacy === "public");

	let selectedStat = "views";
	const getMemeStats = ({ updateDate, views, score, comments }) => {
		const ageMS = new Date() - updateDate;
		const ageDays = Math.floor(ageMS / (1000 * 60 * 60 * 24));
		return { ageDays, views, score, comments: comments.length };
	};
	$: stats = meme && {
		other: publicMemes.filter(({ id }) => id !== meme?.id).map(getMemeStats),
		this: getMemeStats(meme),
	};
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
				<Button on:click={share}>
					{shareButtonText}
				</Button>
				<Button on:click={() => push(`/meme/${meme.id}/edit`)}>
					✏️ Edit
				</Button>
			</div>
			<div class="tts">
				<Button on:click={() => meme.tts("title")}>
					📔 Read Title
				</Button>
				<Button on:click={() => meme.tts("captions")}>
					📰 Read Captions
				</Button>
				<Button on:click={() => meme.description ? meme.tts("description") : tts("This meeme has no description.")}>
					📜 Read Description
				</Button>
			</div>
			<div class="description">
				{#if meme.description}
					{meme.description}
				{:else}
					<i>
						This meme lacks a creator-given description.
						Although we are sure it is very funny and might even contain cats.
					</i>
				{/if}
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

		<div class="graph">
			<h2>Statistics</h2>
			<h3>Compared to other Memes</h3>
			<div class="graph-controls">
				<Button variant={selectedStat === "views" && "primary"} on:click={() => selectedStat = "views"}>
					👁️ Views
				</Button>
				<Button variant={selectedStat === "score" && "primary"} on:click={() => selectedStat = "score"}>
					❤️ Score
				</Button>
				<Button variant={selectedStat === "comments" && "primary"} on:click={() => selectedStat = "comments"}>
					🗨️ Comments
				</Button>
			</div>
			<Graph
				type="scatter"
				datasets={[{
					label: meme.title,
					data: [{
						x: stats?.this.ageDays,
						y: stats?.this[selectedStat],
					}],
					backgroundColor: "#26ba89",
				}, {
					label: "Other Memes",
					data: stats?.other.map(({ ageDays, ...stats }) => ({ x: ageDays, y: stats[selectedStat] })),
					backgroundColor: "hsl(0, 0%, 50%)",
				}]}
				options={{
					scale: {
						ticks: {
							precision: 0,
						},
					},
					scales: {
						y: {
							beginAtZero: true,
							title: {
								display: true,
								text: selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1),
							},
						},
						x: {
							title: {
								display: true,
								text: "Age (in days)",
							},
						},
					},
					plugins: {
						legend: {
							onClick: null,
						},
						tooltip: {
							enabled: false,
						},
					},
				}}
			/>
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

	.content {
		display: flex;
		flex-direction: column;
		gap: 1em;
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
		margin: 1em 0;
	}

	.tts {
		font-size: 0.75em;
		display: flex;
		gap: 0.25em;
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

	.graph-controls {
		font-size: 0.75em;
	}
</style>
