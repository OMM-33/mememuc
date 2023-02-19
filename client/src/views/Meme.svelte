<script>
	import Comment from "../lib/View/Comment.svelte";
	import { memes } from "../cache";
	export let params = {};
	let image;
	let upvotes;
	let views;
	let comments;
	let title;
	let myComment;
	let description;
	let id = params.id;
	let meme = $memes.get(id);

	update();


	function submit(){
		comments.push({ name:"Ines",text:myComment });
		comments = comments; //für reaktivität von svelte
		myComment = "";

	}
	function nextImage(){
		if(id < $memes.size - 1){
			id = String(parseInt(id) + 1);
			meme = $memes.get(id);
		}
		else{
			id= '0';
			meme = $memes.get('0');
		}
		update();
	}
	function lastImage(){
		if(id > 0){
			id = String(parseInt(id) - 1);
			meme = $memes.get(id);
		}
		else{
			id = String($memes.size-1);
			meme = $memes.get(id);
		}
		update();

	}
	function update(){
		comments = $meme.comments;
		title = $meme.title;
		image = $meme.src;
		upvotes = $meme.score;
		views = $meme.views;
		description = $meme.description;


	}

</script>
<div id="slideshow">
	<button id="left"on:click={lastImage}>👈</button>
	<button id="right" on:click={nextImage}>👉</button>
</div>

<div id="container">
	<p id="title">{title}</p>
	<div id="Middle">

		<div style:background-image="url('{image}')" id="image"  />
		<div id="commentsContainer">
			<h2> Comments</h2>
			<div id="comments">
				{#each comments as comment}
					<Comment text={comment.text} name={comment.name} />

				{/each}
			</div>
			<input bind:value={myComment} />
			<button on:click={submit}>Submit</button>

		</div>
	</div>

</div>
<div id="details">
	<p>Details</p>
	<p>Description: {description}</p>
	<p>Upvotes: {upvotes}</p>
	<p>Views: {views}</p>
</div>


<style>
	#middle{
		height: auto;
	}
	#image{
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
	#title{
		color: black;
		font-size: 2em;
		text-align: le;
		width: 70vw;

	}
	#comments{

		overflow-y: auto;
		overflow-x: hidden;
		max-height: 41.5vh;
		width: 30vw;
	}
	#commentsContainer{
		float: right;
		color:black;


	}
	#details{
		color:black;
	}
	#slideshow{
		flex-direction: row;
font-size: 2em;
	}
	#right{

		float:right;
		background-color: transparent;
		border:none;
		font-size: 1.5em;
		cursor: pointer;
	}
	#left{
		float: left;
		background-color: transparent;
		border:none;
		font-size: 1.5em;
		cursor: pointer;
	}

</style>
