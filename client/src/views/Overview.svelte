<script>
	import { memes } from "../cache";
	import Meme from "../models/Meme";

	import Button from "../lib/Button.svelte";
	import Graph from "../lib/Graph.svelte";
	import Frame from "../lib/View/Frame.svelte";
	import InfiniteScroll from "../lib/InfiniteScroll.svelte";

	let sortBy = "updateDate";
	const filter = { type: "viewCount", amount: 0 };

	let memesArray = [];
	let showingAll = false;

	const clearMemes = () => {
		memesArray = [];
		showingAll = false;
	};

	$: {
		// initially or...
		sortBy, filter; // if any of these change...
		clearMemes();
		loadMore();
	}

	const loadMore = async () => {
		if (showingAll) return;
		const newMemes = await Meme.getMultiple({
			published: true,
			lastId: memesArray.at(-1)?.id,
			limit: 6,
			sortBy,
			sortDir: sortBy === "title" ? 1 : undefined,
			filterBy: filter.type,
			filterValue: filter.amount,
			filterOperator: "$gte",
		});
		if (newMemes.length === 0) {
			showingAll = true;
			return;
		}
		newMemes.forEach(meme => $memes.set(meme.id, meme)); // update our cache
		memesArray = memesArray.concat(newMemes);
	};

	const onInfiniteTrigger = () => {
		if (memesArray.length === 0) return;
		loadMore();
	};

	$: stats = Object.fromEntries(
		Object.entries(
			memesArray.reduce((result, meme) => {
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
</script>

<h1>Overview </h1>
<div class="top-controls">
	<div class="sort">
		<label>
			Sort by:
			<select bind:value={sortBy}>
				<option value="updateDate">Date</option>
				<option value="title">Title</option>
			</select>
		</label>
	</div>
	<div class="filter">
		<label>
			at least
		</label>
		<input type="number" bind:value={filter.amount} size="5" min="0" step="1" />
		<select bind:value={filter.type}>
			<option value="viewCount">Views</option>
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
	{#each memesArray as meme}
		<Frame {meme} />
	{/each}
</div>
<InfiniteScroll on:trigger={onInfiniteTrigger} />

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
