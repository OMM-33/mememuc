<script>
	export let error = null;
</script>

{#if error}
	<div class="error">
		<div class="icon">💥</div>
		<div class="text">{error}</div>
	</div>
{/if}

<style>
	.error {
		border-radius: 8px;
		background-color: hsl(var(--c-error-hsl), 0.2);
		color: var(--c-error);
		padding: 1em;

		display: flex;
		align-items: flex-start;
		gap: 0.5em;
	}

	.icon {
		flex-shrink: 0;
	}
</style>
