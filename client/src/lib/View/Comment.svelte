<script>
	export let name;
	export let date;
	export let text;
</script>

<div class="comment">
	<div class="name">{name} <small>({date.toLocaleDateString("en-GB")})</small></div>
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
