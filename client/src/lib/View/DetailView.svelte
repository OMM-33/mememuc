<script>
	import Comment from "./Comment.svelte";
	export let image;
	export let upvotes;
	export let views;
	export let comments;
	export let title;
	export let clicked;
	let myComment;
	function submit(){
		comments.push({ name:"Ines",text:myComment });
		comments = comments; //für reaktivität von svelte
		myComment = "";

	}
	function nextImage(){
		clicked = false;
	}

</script>

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
	<p>Upvotes: {upvotes}</p>
	<p>Views: {views}</p>
</div>
<div id="slideshow">
	<button id="left">👈</button>
	<button id="right" on:click={nextImage}>👉</button>
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
		color: white;
		font-size: 3em;
		text-align: center;
		width: 70vw;

	}
	#comments{

		overflow-y: auto;
		overflow-x: hidden;
		max-height: 41.5vh;
	}
	#commentsContainer{
		float: right;
		color:white;


	}
	#details{
		margin-top: 55vh;
		color:white
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
