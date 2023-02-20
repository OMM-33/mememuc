<script>
	export let upvotes;
	export let views;
	export let comments;
	export let image;
	export let title;
	export let id;

	let upvoted;
	const link = "#/meme/" + id;

	function handleUpvote(){
		if(!upvoted){
			upvotes++;
			upvoted = true;
		}
	}

	function details(){
		views++;
	}

</script>
<div class="container">
	<p class="title">{title}</p>
	<button style:background-image="url('{image}')" class="overviewMeme"  />
	<div class="info"><a href={link} on:click={details}>Single View </a><button class="upvoteButton" on:click={handleUpvote} class:upvoted={upvoted === true}> ⬆️ {upvotes}</button><span class="views">👁️ {views}</span><span class="comments">🗨️ {comments}</span>
	</div>
</div>

<style>
	.container{
		width: 100%;
		margin-top:0px;
		margin-bottom: 20%;
	}
	span{
		padding-left: 10%;
		padding-right: 10%;
		padding-top: 3%;
	}
	.info{
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.overviewMeme{
		width:100%;
		height: 32vh;
		background-size: contain;
		background-repeat: no-repeat;
		background-position: center;
		background-color: #F2F9F2;
		border: 1px solid black;
		cursor: pointer;
	}
	.title{
		margin: 0 5% 5% 5%;
		text-align: center;
		font-size: 1.2em;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}
	.upvoteButton{
  background-color: none;
  border: none;
  margin-left: 10%;
  margin-right: 10%;
  margin-top: 3%;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
 }
 .upvoted{
  background-color:rgb(196, 192, 192);
}
</style>
