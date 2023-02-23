<script>
	import { createEventDispatcher } from "svelte";
	import { templates } from "../../cache";

	import Button from "../Button.svelte";
	import Upload from "./Upload/Upload.svelte";

	const dispatch = createEventDispatcher();

	let uploadOpen = false;
	let color = "#ffffff";

	const pickColor = (() => {
		const input = document.createElement("input");
		input.type = "color";
		return async () => {
			return new Promise(resolve => {
				input.onchange = () => resolve(input.value);
				input.click();
			});
		};
	})();

	let focusIndex = -1;
	const onFocus = index => {
		focusIndex = index;
	};
	const onBlur = index => {
		if (focusIndex === index) focusIndex = -1;
	};
</script>

<div class="templates">
	<h3>Templates</h3>
	<div class="images">
		<button
			class="template color"
			data-sc="choose color"
			on:focusin={() => onFocus(0)}
			on:focusout={() => onBlur(0)}
		>
			<div class="color-rect" style:background-color={color} />
			<div class="template-actions">
				<Button
					on:click={() => dispatch("change-background", { color })}
					data-sc={focusIndex === 0 ? "swap" : undefined}
				>
					🔁 Swap template
				</Button>
				<Button on:click={async () => color = await pickColor()}>
					🎨 Choose a color
				</Button>
			</div>
		</button>
		{#each [...$templates.values()] as template, i}
			<button
				class="template image"
				data-sc="choose {i + 1}"
				on:focusin={() => onFocus(i + 1)}
				on:focusout={() => onBlur(i + 1)}
			>
				<img src={template.src} />
				<div class="template-actions">
					<Button
						on:click={() => dispatch("change-background", { media: template })}
						data-sc={focusIndex === i + 1 ? "swap" : undefined}
					>
						🔁 Swap template
					</Button>
					<Button
						on:click={() => dispatch("add-layer", { media: template })}
						data-sc={focusIndex === i + 1 ? "place" : undefined}
					>
						🖼️ Place as layer
					</Button>
				</div>
			</button>
		{/each}
	</div>
	<div class="actions">
		<Button on:click={() => uploadOpen = true}>➕ Add</Button>
	</div>
</div>

<Upload bind:open={uploadOpen} on:new={() => uploadOpen = false} />

<style>
	.templates {
		padding: 1em;
		background-color: var(--c-black);
		color: var(--c-white);
	}

	.images {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
		grid-auto-rows: min(15vh, 128px);
		gap: 1em;
		max-height: calc(min(15vh, 128px) + 1em + 1em); /* show a bit of the next row to suggest there's more */
		overflow-y: scroll;
	}

	button.template {
		position: relative;
		appearance: none;
		border: none;
		border-radius: none;
		background: none;
		padding: 0;
		margin: 0;
		font: inherit;

		background: repeating-conic-gradient(whitesmoke 0% 25%, white 0% 50%) 50% / 20px 20px
	}

	.template-actions {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
		font-size: 0.75em;

		visibility: hidden;
		position: absolute;
		inset: 0;
		opacity: 0;

		transition: opacity 300ms ease, visibility 0ms linear 300ms;
	}
	.image .template-actions {
		background-color: hsl(var(--c-accent-hsl), 0.75);
	}
	button.template:focus .template-actions,
	button.template:focus-within .template-actions {
		visibility: visible;
		opacity: 1;
		transition: opacity 300ms ease;
	}

	img, .color-rect {
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	img {
		object-fit: cover;
	}

	.actions {
		margin-top: 1em;
	}
</style>
