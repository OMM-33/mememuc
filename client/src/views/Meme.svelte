<script>
	import Comment from "../lib/View/Comment.svelte";
	import { memes } from "../cache";
	import { push } from 'svelte-spa-router'
	export let params = {};
	let id = params.id;


	let myComment;


	function submit(){
		$memes.get(id).comments.push({ name:"Ines",text:myComment });
		$memes.get(id).comments =  $memes.get(id).comments; //für reaktivität von svelte
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
	<h1 class="title">{$memes.get(id).title}</h1>
	<div class="flexbox">
		<div style:background-image="url('{$memes.get(id).src}')" class="meme"  />
		<div style:padding-left="">
			<h2> Comments</h2>
			<div class="comments">
				{#each  $memes.get(id).comments as comment}
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
	<p>Description: {$memes.get(id).description}</p>
	<p>Upvotes: {$memes.get(id).upvotes}</p>
	<p>Views: {$memes.get(id).views}</p>
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
