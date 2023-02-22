<script>
	import { memes, updateMemes } from "../cache";

	import Button from "../lib/Button.svelte";
	import Graph from "../lib/Graph/Graph.svelte";
	import Frame from "../lib/View/Frame.svelte";

	updateMemes();

	const memesArray = [];
	$: {
		const memeStores = [...$memes.values()];
		memeStores.forEach((store, i) => store.subscribe(value => memesArray[i] = value));
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
</script>

<h1>Overview </h1>
<div class="top-controls">
	<Button style="margin-left: auto" on:click={() => statsVisible = !statsVisible}>
		📉 {statsVisible ? "Hide" : "Show"} Statistics
	</Button>
</div>
{#if statsVisible}
	<div class="graph">
		<Graph
			type="line"
			labels={Object.keys(stats)}
			datasets={[{
				label: "Memes created",
				data: Object.values(stats),
				borderWidth: 1,
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


<style>
	.top-controls {
		display: flex;
		font-size: 0.75em;
		margin-bottom: 1em;

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
