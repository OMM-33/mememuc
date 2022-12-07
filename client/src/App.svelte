<script>
	import svelteLogo from "./assets/svelte.svg";
	import Counter from "./lib/Counter.svelte";
</script>

<main>
	<div>
		<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
			<img src="./vite.svg" class="logo" alt="Vite Logo" />
		</a>
		<a href="https://svelte.dev" target="_blank" rel="noreferrer">
			<img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
		</a>
	</div>
	<h1>MemeMuc - Team 33</h1>
	<Counter />
</main>

<style>
	.logo {
		height: 6em;
		padding: 1em;

		transition: filter 200ms ease;
		will-change: filter;
	}
	.logo:hover {
		filter: drop-shadow(0 0 2em #646cffaa);
	}
	.logo.svelte:hover {
		filter: drop-shadow(0 0 2em #ff3e00aa);
	}
</style>
