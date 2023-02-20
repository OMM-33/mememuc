<script>
	import Button from "./Button.svelte";

	/** @type {{ func?: () => void, label?: string }} */
	export let close = { func: undefined, label: undefined };
	export let scroll = false;

</script>

<div class="card">
	{#if $$slots.header || close.func}
		<div class="header">
			<slot name="header" />
			{#if close.func}
				<div class="close-button">
					<Button aria-label="close" on:click={close.func}>{close.label || "❌"}</Button>
				</div>
			{/if}
		</div>
	{/if}
	<div class="body" style:overflow-y={scroll ? "auto" : ""}>
		<slot />
	</div>
	{#if $$slots.footer}
		<div class="footer">
			<slot name="footer" />
		</div>
	{/if}
</div>

<style>
.card {
	--border-between: 1px solid hsl(var(--c-black-hsl), 0.25);

	display: flex;
	flex-direction: column;
	max-width: 100%;
	max-height: 100%;

	border-radius: 0.5em;
	background-color: var(--c-white);
	box-shadow: 0 0 2em 0 hsl(var(--c-black-hsl), 0.1);
}

.body {
	flex-grow: 1;
	min-height: 0;
	padding: 1em;
	display: flex;
	flex-direction: column;
}

.header, .footer {
	padding: 0.5em 1em;
	display: flex;
	align-items: center;
}
.header { border-bottom: var(--border-between) }
.footer { border-top: var(--border-between) }

.close-button {
	display: flex;
	margin-left: auto;
	padding-left: 1em;
}
</style>
