<script>
	import Button from "./Button.svelte";
</script>

<nav>
	<div class="left">
		<a href="#/" class="title"><b>MemeMuc</b></a>
		<a href="#/">Overview</a>
		<a href="#/meme/edit">Create</a>
		<a href="#/user/">My Profile</a>
	</div>
	<div class="right">
		<Button element="a" href="#/login">Log In</Button>
		<Button element="a" href="#/signup" variant="primary">Sign Up</Button>
	</div>
</nav>


<style lang="postcss">
	nav {
		position: sticky;
		width: 100%;

		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5em;

		background-color: var(--c-white-light);
		box-shadow: 0 0 2em rgba(0, 0, 0, 0.2);

		> div {
			display: flex;
			&.left { gap: 1em; }
			&.right { gap: 0.5em; }
		}
	}

	.title {
		color: inherit;
		margin-right: 1em;
	}
</style>
