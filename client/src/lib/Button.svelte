<script>
	/** @type {"default" | "primary"} */
	export let variant = "default";
	/** @type {"default" | "tab"} */
	export let shape = "default";
	export let element = "button";
	export let type = "button";
</script>

<svelte:element
	this={element}
	class={`button shape-${shape} ${variant}`}
	{type}
	{variant}
	{...$$restProps}
	on:click
>
	<slot />
</svelte:element>

<style>
	.button {
		--border-color: var(--c-link);

		display: inline-block;
		appearance: none;

		border-radius: 0.5em;
		border: 2px solid transparent;
		padding: 0.5em 1em;
		font-family: inherit;
		font-size: 1em;
		font-weight: 500;
		line-height: inherit;
		background-color: hsl(var(--c-white-h), var(--c-white-s), calc(var(--c-white-l) - 8%));
		transition: border-color 300ms;
		color: var(--c-black);

		cursor: default;
	}

	.button.shape-tab {
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0;
		border-bottom: none;
	}

	.button.primary {
		--border-color: hsl(var(--c-accent-h), var(--c-accent-s), calc(var(--c-accent-l) - 25%));
		background-color: var(--c-accent);
		color: var(--c-white);
	}

	.button:hover:not(:disabled),
	.button:focus:not(:disabled) {
		border-color: var(--border-color);
	}

	.button:disabled {
		opacity: 0.5;
	}
</style>
