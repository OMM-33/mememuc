<script>
	import Transformable from "./Transformable.svelte";
	import DefaultOptions from "./DefaultOptions.svelte";

	export let origin;
	export let angle;
	export let size;
	export let options;

	export let isFirst;
	export let isLast;

	const alignMap = {
		0: "left",
		1: "center",
		2: "right",
	};

	// We need to override the paste event to only accept plain-text.
	// Otherwise rich-text HTML can be pasted for... interesting results.
	const onPaste = (event) => {
		event.preventDefault();
		const text = (event.clipboardData || window.clipboardData).getData("text");
		const selection = window.getSelection();

		if (selection.rangeCount > 0) {
			selection.deleteFromDocument();
			selection.getRangeAt(0).insertNode(document.createTextNode(text));
			selection.collapseToEnd();
		}
	};
</script>

<Transformable bind:origin bind:angle bind:size {...$$restProps} on:changeselect>
	<div
		contenteditable
		class="text"
		style:color={options.font.color}
		style:--color-stroke={options.font.colorStroke}
		style:font-size="{options.font.size}px"
		style:text-align={alignMap[options.font.align]}
		on:drop={e => e.preventDefault()}
		on:dragover={e => e.preventDefault()}
		on:paste={onPaste}
		bind:innerHTML={options.text}
	/>
	<svelte:fragment slot="options">
		<input type="number" size="4" bind:value={options.font.size} />
		<input type="color" bind:value={options.font.color} />
		<input type="color" bind:value={options.font.colorStroke} />
		<select bind:value={options.font.align}>
			<option value={0}>left</option>
			<option value={1}>center</option>
			<option value={2}>right</option>
		</select>
		<DefaultOptions on:moveZ on:duplicate on:delete {isFirst} {isLast} />
	</svelte:fragment>
</Transformable>

<style>
	.text {
		overflow: hidden;
		height: 100%;

		font-family: var(--font-meme);
		-webkit-text-stroke: 0.03125em var(--color-stroke);
		letter-spacing: 0.03125em;
		line-height: 1;
	}
	.text:focus,
	.text:focus-visible {
		outline: none;
	}
</style>
