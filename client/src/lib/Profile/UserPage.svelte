<script>
	import { push } from "svelte-spa-router";

	import Frame from "../View/Frame.svelte";
	import Button from "../Button.svelte";
	import Error from "../Error.svelte";
	import { memes } from "../../cache.js";

	const user = { id: 1, name: "Alice", createdMeme: [2,4,5] };
	let error = null;

	$: userMeme = user.createdMeme.map((el) => [...$memes.values()][el]);

	async function handleDelete(el){
		const response = await fetch("/api/meme",
			{
				method: "DELETE",
				body: JSON.stringify({ id: el.id }),
				headers: {
					"content-type": "application/json",
				},
			});

		if (!response.ok) {
			error = (await response.json()).message;
			return;
		}

		const json = await response.json();

		if (json.success){
			window.location.href = "/";
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
				<Button class="item" data-sc="edit" on:click={()=>push("/meme/:id?/edit")}>✏ Edit</Button>
			{/if}
			<Button class="item delete" data-sc="delete" on:click={()=>handleDelete(meme)}>🗑️ Delete</Button>
			<div>
				<Frame {meme} />
			</div>
		</div>
	{/each}
</div>

