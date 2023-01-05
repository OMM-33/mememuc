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
		max-width: 1200px;
		margin: 0 auto;
	}
</style>
