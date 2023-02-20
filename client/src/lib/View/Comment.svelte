<script>
	export let name;
	export let text;
</script>

<div class="comment">
	<div class="name">{name}</div>
	<div class="text">{text}</div>
</div>
<style>
	.comment {
		background-color: var(--c-white-bright);
	}

	.name {
		font-weight: 600;
		background-color: var(--c-accent);
		padding: 0.25em 1em;
	}
	.text {
		padding: 1em;
	}
</style>
