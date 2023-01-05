<!--
	This component overrides the global cursor depending on the active editing mode.
	It technically breaks the component principle but it works nicely for the scope of the project.
-->
<script>
	export let drag;
</script>

<svelte:head>
	{#if drag?.mode === "origin"}
		<style>body { cursor: move }</style>
	{:else if drag?.mode === "angle"}
		<style>body { cursor: grabbing }</style>
	{:else if drag?.mode === "size"}
		{#if drag.axis === "ns"}
			<style>body { cursor: ns-resize }</style>
		{:else if drag.axis === "ew"}
			<style>body { cursor: ew-resize }</style>
		{:else if drag.axis === "nesw"}
			<style>body { cursor: nesw-resize }</style>
		{:else if drag.axis === "nwse"}
			<style>body { cursor: nwse-resize }</style>
		{/if}
	{/if}
</svelte:head>
