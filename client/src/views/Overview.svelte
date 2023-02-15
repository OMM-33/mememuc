<h1>Overview </h1>
<script>
	import Frame from "../lib/Overview/Frame.svelte";

	const images =[{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/T8Hhkur.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/Uschheg.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/Jvh1OQm.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/jlFgGpe.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/K6U0L3q.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/rFBiyeR.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/g81WFjQ.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/0LINzxs.jpeg",
	},{ stats: { upvotes: 2,views:5,comments:1 },
		src: "https://i.imgur.com/xp4WKjC.jpeg",
	}];

</script>
<div class="grid">
	{#each images as image}
		<Frame image={image.src} upvotes={image.stats.upvotes} views={image.stats.views} comments={image.stats.comments} />
	{/each}
</div>

<style>
	.grid{
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		justify-content: space-between;
	}
</style>
