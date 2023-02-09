<script>
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import Navigation from "./lib/Navigation.svelte";
</script>

<Navigation />
<main>
	<Router {routes} />
</main>

<style>
	main {
		flex-grow: 1;

		width: 100%;
		max-width: 1200px;
		padding: 1em;

		display: flex;
		flex-direction: column;
	}
	main :global(> *) {
		flex-shrink: 0;
	}
</style>
