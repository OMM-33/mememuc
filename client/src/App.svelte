<script>
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import Navigation from "./lib/Navigation.svelte";
</script>

<main>
	<Navigation />
	<Router {routes} />
</main>
