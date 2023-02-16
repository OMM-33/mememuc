<h1>Overview </h1>
<script>
	import Frame from "../lib/View/frame.svelte";
	import Overlay from "../lib/Overlay.svelte";
	import DetailView from "../lib/View/DetailView.svelte";

	const images = [{ id:1,title:"Titel", stats: { upvotes: 2,upvoted: false,views:7,comments:1 ,clicked: false }, comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/T8Hhkur.jpeg",
	},{ id: 2,title:"Titel",stats: { upvotes: 2,upvoted: true,views:5,comments:1 }, comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/Uschheg.jpeg",
	},{ id:3, title:"Sehr sehr sehr sehr sehr sehr sehr sehr langer Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }] ,
		src: "https://i.imgur.com/Jvh1OQm.jpeg",
	},{ id:4, title:"Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/jlFgGpe.jpeg",
	},{ id:5, title:"Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/K6U0L3q.jpeg",
	},{ id:6,title:"Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/rFBiyeR.jpeg",
	},{ id:7, title:"Langer Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/g81WFjQ.jpeg",
	},{ id:8,title:"Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/0LINzxs.jpeg",
	},{ id:9,title:"Titel",stats: { upvotes: 2,upvoted: false,views:5,comments:1,clicked: false },comments:[{ name:"Ines",text:"I love cats" },{ name:"Felix",text:"I don't like cats" }],
		src: "https://i.imgur.com/xp4WKjC.jpeg",
	}];

</script>
<div class="grid">
	{#each images as image}
		<Frame  title={image.title} image={image.src} bind:upvotes={image.stats.upvotes} bind:upvoted={image.stats.upvoted} bind:views={image.stats.views} comments={image.stats.comments} bind:clicked={image.stats.clicked} />
		<Overlay bind:open={image.stats.clicked}>
			<DetailView title={image.title} image={image.src} upvotes={image.stats.upvotes} bind:comments={image.comments} bind:views={image.stats.views} /></Overlay>
	{/each}
</div>


<style>
	.grid{
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		justify-content: space-between;
	}
</style>
