<script>
	import { onMount } from "svelte";
	import { getUID } from "../../../util";
	import Button from "../../Button.svelte";

	export let onNew, onError;

	const uid = getUID();
	let images = [];
	let selectedIndex = -1;

	onMount(async () => {
		try {
			const response = await fetch("https://api.imgflip.com/get_memes");
			const json = await response.json();
			images = json.data.memes?.map(({ url }) => url) || [];
		} catch (error) {
			onError(error);
		}
	});

	const onConfirm = () => {
		if (selectedIndex < 0) return;

		onNew({ src: images[selectedIndex] });
	};
</script>

<div class="img-flip">
	<div class="grid">
		{#each images as src, i}
			<div class="image">
				<label for="image-{i}-{uid}">
					<img {src} />
				</label>
				<input
					type="radio"
					name="images-{uid}"
					id="image-{i}-{uid}"
					on:change={() => selectedIndex = i}
				/>
			</div>
		{/each}
	</div>
	<Button on:click={onConfirm} disabled={selectedIndex < 0}>Use Image</Button>
</div>

<style>
	.img-flip {
		height: 100%;

		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
		grid-auto-rows: 128px;
		gap: 1em;

		flex-basis: 0;
		flex-grow: 1;
		overflow-y: auto;
	}

	.image {
		position: relative;
	}

	.image img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image input[type=radio] {
		position: absolute;
		bottom: 0.25em;
		right: 0.25em;
		z-index: 1;
	}
</style>
