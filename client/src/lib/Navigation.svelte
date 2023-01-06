<script>
	import Button from "./Button.svelte";
</script>

<nav>
	<div class="left">
		<a href="#/" class="title"><b>MemeMuc</b></a>
		<a href="#/" data-sc="overview">Overview</a>
		<a href="#/meme/edit" data-sc="create">Create</a>
		<a href="#/user/" data-sc="profile">My Profile</a>
	</div>
	<div class="right">
		<Button element="a" href="#/login" data-sc="login">Login</Button>
		<Button element="a" href="#/signup" data-sc="sign up" variant="primary">Sign Up</Button>
	</div>
</nav>


<style>
	nav {
		position: sticky;
		width: 100%;

		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5em;

		background-color: var(--c-white-bright);
		box-shadow: 0 0 2em rgba(0, 0, 0, 0.2);
	}

	nav > div { display: flex; }
	nav > div.left { gap: 1.5em; }
	nav > div.right { gap: 0.5em; }

	.title {
		color: inherit;
		margin-right: 1em;
	}
</style>
