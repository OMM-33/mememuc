<script>
	import Router from "svelte-spa-router";
	import routes from "./routes";
	import Navigation from "./lib/Navigation.svelte";
	import SpeechControl from "./lib/SpeechControl.svelte";

	import "tippy.js/dist/tippy.css";
</script>

<Navigation />
<main>
	<Router {routes} />
</main>
<div class="speech-control">
	<SpeechControl rootEl={document.getElementById("app")} />
</div>

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

	.speech-control {
		position: fixed;
		bottom: 0.5em;
		right: 0.5em;
		z-index: 500;
	}
</style>
