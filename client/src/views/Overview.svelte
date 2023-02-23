<script>
	import { memes, updateMemes } from "../cache";

	import Button from "../lib/Button.svelte";
	import Graph from "../lib/Graph.svelte";
	import Frame from "../lib/View/Frame.svelte";
	import InfiniteScroll from "../lib/InfiniteScroll.svelte";

	updateMemes();

	let memesArray = [];
	$: {
		const result = [];
		const memeStores = [...$memes.values()];
		memeStores.forEach((store, i) => store.subscribe(value => result[i] = value));
		memesArray = result;
	}

	$: publicMemes = memesArray.filter(({ privacy }) => privacy === "public");

	$: stats = Object.fromEntries(
		Object.entries(
			publicMemes.reduce((result, meme) => {
				const date = meme.updateDate;
				const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
				if (!result[dateStr]) result[dateStr] = 0;
				result[dateStr]++;
				return result;
			}, {}),
		)
			.sort(([dateA], [dateB]) => dateA < dateB ? -1 : 1)
			.map(([date, count]) => {
				const [year, month] = date.split("-");
				return [`${month}/${year}`, count];
			}),
	);

	let statsVisible = false;

	let sortBy = "date";
	const filter = { type: undefined, amount: 10 };
	$: console.log("sortBy", sortBy);
	$: console.log("filter", filter);

	function onInfiniteScrollTrigger() {
		console.log("scroll");
	}
</script>

<h1>Overview </h1>
<div class="top-controls">
	<div class="sort">
		<label>
			Sort by:
			<select bind:value={sortBy}>
				<option value="date">Date</option>
				<option value="title">Title</option>
			</select>
		</label>
	</div>
	<div class="filter">
		<label>
			more than
		</label>
		<input type="number" bind:value={filter.amount} size="5" />
		<select bind:value={filter.type}>
			<option value="views">Views</option>
			<option value="score">Score</option>
		</select>
	</div>
	<div class="stats-toggle">
		<Button on:click={() => statsVisible = !statsVisible}>
			📉 {statsVisible ? "Hide" : "Show"} Statistics
		</Button>
	</div>
</div>
{#if statsVisible}
	<div class="graph">
		<Graph
			type="line"
			labels={Object.keys(stats)}
			datasets={[{
				label: "Memes created",
				data: Object.values(stats),
				backgroundColor: "#26ba8955",
				borderColor: "#26ba89",
			}]}
			options={{
				scale: {
					ticks: {
						precision: 0,
					},
				},
			}}
		/>
	</div>
{/if}
<div class="grid">
	{#each publicMemes as meme}
		<Frame {meme} />
	{/each}
</div>
<InfiniteScroll on:trigger={onInfiniteScrollTrigger} />

<style>
	.top-controls {
		display: flex;
		justify-content: space-between;
		gap: 2em;
		font-size: 0.75em;
		margin-bottom: 1em;
	}

	.top-controls > * {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	.graph {
		margin-bottom: 4em;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		justify-content: space-between;
		row-gap: 4em;
		column-gap: 1em;
	}
</style>
