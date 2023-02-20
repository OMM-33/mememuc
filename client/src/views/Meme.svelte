<script>
	import Comment from "../lib/View/Comment.svelte";
	import { memes } from "../cache";
	import { push } from 'svelte-spa-router'
	export let params = {};
	let id = params.id;
	const meme = $memes.get(id);

	const image = $meme.src;
	const upvotes = $meme.score;
	const views = $meme.views;
	const title = $meme.title;
	const description = $meme.description;

	let myComment;


	function submit(){
		$meme.comments.push({ name:"Ines",text:myComment });
		$meme.comments = $meme.comments; //für reaktivität von svelte
		myComment = "";

	}
	function nextImage(){
		console.log("Next");
		if(id < $memes.size - 1){
			id = String(parseInt(id) + 1);
		}
		else{
			id = "0";
		}
		push("#/meme/" + id);
	}
	function lastImage(){
		if(id > 0){
			id = String(parseInt(id) - 1);
		}
		else{
			id = String($memes.size - 1);
		}
		push("#/meme/" + id);

	}

</script>
<div  class="flexbox">
	<button class="nextbefore" on:click={lastImage}>👈</button>
	<button class="nextbefore" on:click={nextImage}>👉</button>
</div>

<div>
	<h1 class="title">{title}</h1>
	<div class="flexbox">
		<div style:background-image="url('{image}')" class="meme"  />
		<div style:padding-left="">
			<h2> Comments</h2>
			<div class="comments">
				{#each $meme.comments as comment}
					<Comment text={comment.text} name={comment.name} />

				{/each}
			</div>
			<textarea bind:value={myComment} />
			<button on:click={submit}>Submit</button>

		</div>
	</div>

</div>
<div>
	<p>Details</p>
	<p>Description: {description}</p>
	<p>Upvotes: {upvotes}</p>
	<p>Views: {views}</p>
</div>


<style>
	.flexbox{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.meme{
		width:50vw;
		height: 50vh;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		background-color: #F2F9F2;
		border: 1px solid black;
		justify-self: center;
		float:left
	}
	.comments{

		overflow-y: auto;
		overflow-x: hidden;
		max-height: 41.5vh;
		width: 30vw;
	}
	.nextbefore{
		background-color: transparent;
		border:none;
		font-size: 2em;
		cursor: pointer;

	}

</style>
