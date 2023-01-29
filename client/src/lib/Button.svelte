<script>
	export let element = "button";
	export let variant = "default";
	export let type = "button";
</script>

<svelte:element
	this={element}
	class={`button ${variant}`}
	{type}
	{variant}
	{...$$restProps}
	on:click
>
	<slot />
</svelte:element>

<style>
	.button {
		display: inline-block;
		appearance: none;

		border-radius: 8px;
		border: 2px solid transparent;
		padding: 0.5em 1em;
		font-family: inherit;
		font-size: 1em;
		font-weight: 500;
		background-color: var(--c-white-dark);
		transition: border-color 300ms;
		color: var(--c-black);
	}

	.button.primary {
		background-color: var(--c-accent);
		color: var(--c-white);
	}

	.button:hover {
		border-color: var(--c-link-hover);
	}
</style>
