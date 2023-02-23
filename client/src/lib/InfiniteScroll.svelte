<script>
	import { createEventDispatcher, onMount } from "svelte";

	const dispatch = createEventDispatcher();

	let el = null;
	const observer = new IntersectionObserver(([{ isIntersecting }]) => {
		if (isIntersecting) dispatch("trigger");
	}, { threshold: 1.0 });

	onMount(() => {
		observer.observe(el);
	});
</script>

<div class="infinite-scroll-activator" bind:this={el} />
