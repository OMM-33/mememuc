<script>
	import { push } from "svelte-spa-router";
	import { memes, updateMemes } from "../../cache.js";
	import { user } from "../../auth.js";
	import { privacyLevels } from "../../models/Meme.js";

	import Frame from "../View/Frame.svelte";
	import Button from "../Button.svelte";
	// import Error from "../Error.svelte";

	// let error = null;
	// const onError = detail => error = detail;

	updateMemes();

	let memesArray = [];
	$: {
		const result = [];
		const memeStores = [...$memes.values()];
		memeStores.forEach((store, i) => store.subscribe(value => result[i] = value));
		memesArray = result;
	}

	$: userMemes = memesArray.filter(({ creatorID }) => creatorID === $user.id);

/* async function handleDelete(meme) {
		try {
			await meme.delete();
		} catch (error) {
			onError(error.message);
		}
	} */
</script>

<style>
	.grid {
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

<h1 class="user">{$user.name}'s Memes</h1>
<!-- <Error {error} /> -->
<div class="grid">
	{#each userMemes as meme}
		<div>
			<p class="item">
				{privacyLevels[meme.privacy].icon} {privacyLevels[meme.privacy].label}
			</p>
			{#if meme.privacy === "private"}
				<Button class="item" data-sc="edit" on:click={() => push(`/meme/${meme.id}/edit`)}>
					✏️ Edit
				</Button>
			{/if}
			<!--
			<Button class="item delete" data-sc="delete" on:click={() => handleDelete(meme)}>
				🗑️ Delete
			</Button>
			-->
			<div>
				<Frame {meme} />
			</div>
		</div>
	{/each}
</div>
