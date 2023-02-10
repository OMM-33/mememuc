<script>
	import { createEventDispatcher } from "svelte";
	import Button from "./Button.svelte";

	const dispatch = createEventDispatcher();

	export let tabs = [];

	let activeIndex = 0;

	const onChange = index => {
		activeIndex = index;
		dispatch("change", index);
	};
</script>

<div class="tabs">
	<div class="tabs-row">
		{#each tabs as { title }, i}
			<Button
				shape="tab"
				variant={i === activeIndex && "primary"}
				on:click={() => onChange(i)}
			>
				{title}
			</Button>
		{/each}
	</div>
	<div class="content">
		<svelte:component this={tabs[activeIndex]?.component} {...tabs[activeIndex]?.props || []} />
	</div>
</div>

<style>
	.tabs {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	.tabs-row {
		border-bottom: 2px solid var(--c-accent);

		display: flex;
		flex-wrap: wrap;
		gap: 2px;
	}

	.content {
		flex-basis: 0;
		flex-grow: 1;
		overflow-y: auto;
	}
</style>
