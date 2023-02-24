<script>
	import { push } from "svelte-spa-router";
	import Frame from "../View/Frame.svelte";
	import Button from "../Button.svelte";
	import Error from "../Error.svelte";
	import Meme from "../../models/Meme.js";
	import { memes } from "../../cache.js";

	let error = null;
	const onError = detail => error = detail;

	//TODO: Fetch memes from a server
	const user = { id: 1, name: "Alice", createdMeme: [2,4,5] };
	$: userMeme = user.createdMeme.map((el) => [...$memes.values()][el]);

	async function handleDelete(){
		try {
			await Meme.delete();
		} catch (error) {
			onError(error.message);
		}
	}

</script>

<style>
	.user{
		padding-bottom: 70px;
	}

	.grid{
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
		justify-content: space-between;
		row-gap: 4em;
		column-gap: 1em;
	}

	.item {
		display: inline-block;
	}
</style>

<h1 class="user">{user.name}'s memes</h1>
<Error {error} />
<div class="grid">
	{#each userMeme as meme}
		<div>
			<p class="item">
				{#if meme.privacy === "public"}
					🌐 public
				{:else}
					{#if meme.privacy === "unlisted"}
						🔓 unlisted
					{:else}
						🔒 private (Draft)
					{/if}
				{/if}
			</p>
			{#if meme.privacy === "private"}
				<Button class="item" data-sc="edit" on:click={() => push(`/meme/${meme.id}/edit`)}>✏ Edit</Button>
			{/if}
			<Button class="item delete" data-sc="delete" on:click={() => handleDelete()}>🗑️ Delete</Button>
			<div>
				<Frame {meme} />
			</div>
		</div>
	{/each}
</div>

