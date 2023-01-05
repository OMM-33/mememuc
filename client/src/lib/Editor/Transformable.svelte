<script>
	import { clamp, snap } from "../../util";
	import { onMount, onDestroy, createEventDispatcher } from "svelte";

	import TransformableCursor from "./TransformableCursor.svelte";

	const dispatch = createEventDispatcher();

	export let origin = [0, 0];
	export let angle = 0;
	export let size = [0, 0];

	export let isSelected = false;
	export let canvasSize;

	/** @type {null | { mode: "origin" | "angle" | "size", dir?: "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw", axis?: "ns" | "ew" | "nesw" | "nwse" }} */
	let drag = null;
	let pointerPos = [null, null];
	let el;
	let elContent;
	/** @type {null | DOMRect} */
	let elContentRect = null;

	const dirToTurn = dir => {
		return {
			"n": 0 / 8, "ne": 1 / 8, "e": 2 / 8, "se": 3 / 8,
			"s": 4 / 8, "sw": 5 / 8, "w": 6 / 8, "nw": 7 / 8,
		}[dir];
	};

	const turnToAxis = turn => {
		const turnAxes = [[0.0, "ns"], [1.0, "ns"], [0.5, "ew"], [0.25, "nesw"], [0.75, "nwse"]];

		const axisAngle = turn % 0.5 * 2;
		return turnAxes.find(([turn]) => {
			return axisAngle >= turn - 1 / 8 && axisAngle <= turn + 1 / 8;
		})[1];
	};

	const toggleDragListeners = (on = false) => {
		const method = on ? "addEventListener" : "removeEventListener";
		window[method]("pointermove", onDragMove);
		window[method]("pointerup", onDragEnd);
	};

	const onDragStart = ({ clientX, clientY }, dragOptions) => {
		if (dragOptions.dir) {
			dragOptions.axis = turnToAxis(angle + dirToTurn(dragOptions.dir));
		}

		drag = dragOptions;
		pointerPos = [clientX, clientY];
		toggleDragListeners(true);
	};

	const onDragMove = ({ clientX, clientY }) => {
		const movement = [clientX - pointerPos[0], clientY - pointerPos[1]];
		pointerPos = [clientX, clientY];
		elContentRect = elContent.getBoundingClientRect();

		switch (drag.mode) {
			case "origin": {
				const movementFrac = movement.map((coord, i) => coord / canvasSize[i]);
				origin = origin.map((coord, i) => coord + movementFrac[i]);
				break;
			}
			case "angle": {
				const center = [elContentRect.x + elContentRect.width / 2, elContentRect.y + elContentRect.height / 2];
				const offset = pointerPos.map((coord, i) => coord - center[i]);
				const frac = (Math.atan2(offset[1], offset[0]) / Math.PI / 2 + 0.25 + 1) % 1;
				angle = snap(frac, 1 / 64);
				break;
			}
			case "size": {
				const e = drag.dir.includes("e");
				const w = drag.dir.includes("w");
				const s = drag.dir.includes("s");
				const n = drag.dir.includes("n");

				// Algorithm credit to: https://stackoverflow.com/a/64733307

				const angleRadians = angle * Math.PI * 2;
				const cos = Math.cos(angleRadians);
				const sin = Math.sin(angleRadians);
				const aspectRatio = canvasSize[0] / canvasSize[1];
				const mins = [32 / canvasSize[0], 32 / canvasSize[1]];
				const maxs = [1.25, 1.25];
				const initialSize = [...size];

				const rotatedMovementFrac = [
					(movement[0] * cos + movement[1] * sin) / canvasSize[0],
					(movement[1] * cos - movement[0] * sin) / canvasSize[1],
				];

				if (e || w) {
					if (e) size[0] += rotatedMovementFrac[0];
					else size[0] -= rotatedMovementFrac[0];

					if (size[0] < mins[0]) {
						size[0] = mins[0];
						rotatedMovementFrac[0] = (mins[0] - initialSize[0]) * (e ? 1 : -1);
					} else if (size[0] > maxs[0]) {
						size[0] = maxs[0];
						rotatedMovementFrac[0] = (maxs[0] - initialSize[0]) * (e ? 1 : -1);
					}

					origin[0] += rotatedMovementFrac[0] * cos / 2;
					origin[1] += rotatedMovementFrac[0] * sin / 2 * aspectRatio;
				}
				if (n || s) {
					if (s) size[1] += rotatedMovementFrac[1];
					else size[1] -= rotatedMovementFrac[1];

					if (size[1] < mins[1]) {
						size[1] = mins[1];
						rotatedMovementFrac[1] = (mins[1] - initialSize[1]) * (s ? 1 : -1);
					} else if (size[1] > maxs[1]) {
						size[1] = maxs[1];
						rotatedMovementFrac[1] = (maxs[1] - initialSize[1]) * (s ? 1 : -1);
					}

					origin[0] -= rotatedMovementFrac[1] * sin / 2 / aspectRatio;
					origin[1] += rotatedMovementFrac[1] * cos / 2;
				}
				break;
			}
		}
	};

	const onDragEnd = () => {
		drag = null;
		toggleDragListeners(false);
	};

	onMount(() => {
		elContentRect = elContent.getBoundingClientRect();
	});

	onDestroy(() => {
		toggleDragListeners(false);
	});

	$: origin = origin.map(coord => clamp(coord, 0.0, 1.0));
</script>

<div
	class="transformable {drag ? `dragging-${drag.mode}` : ""}"
	class:selected={isSelected}
	class:dragging={drag}
	style:--origin-x="{origin[0] * 100}%"
	style:--origin-y="{origin[1] * 100}%"
	style:--angle="{angle}turn"
	style:--size-x="{size[0] * 100}%"
	style:--size-y="{size[1] * 100}%"
	tabindex="-1"
	bind:this={el}
	on:focusin={() => dispatch("changeselect", true)}
	on:focusout={({ relatedTarget }) => {
		if (!el.contains(relatedTarget)) dispatch("changeselect", false);
	}}
>
	<!--
		We want the actual visible controls to be displayed above the content
		while the content should be interactable in front of this drag handle (the background).
	-->
	<div class="origin-drag-handle" on:pointerdown={(event) => onDragStart(event, { mode: "origin" })} />
	<div class="content-clip-box">
		<div
			class="content"
			bind:this={elContent}
		>
			<slot />
		</div>
	</div>
	<div class="controls">
		{#if $$slots.options}
			<div
				class="control options"
				style:--box-height="{elContentRect?.height}px"
				style:--box-width="{elContentRect?.width}px"
			>
				<slot name="options" />
			</div>
		{/if}
		<div class="controls-rotated">
			<div class="control origin" />
			<div class="control angle" on:pointerdown={(event) => onDragStart(event, { mode: "angle" })} />
			{#each ["n", "ne", "e", "se", "s", "sw", "w", "nw"] as dir}
				<div
					class="control size {dir}"
					style:cursor={`${turnToAxis(angle + dirToTurn(dir))}-resize`}
					on:pointerdown={(event) => onDragStart(event, { mode: "size", dir })}
				/>
			{/each}
		</div>
	</div>
</div>

<TransformableCursor {drag} />

<style lang="postcss">
	.transformable {
		--padding: 16px;
		--padding-half: calc(var(--padding) / 2);
		--border-thickness: 2px;

		position: absolute;
		inset: 0;

		pointer-events: none;
	}

	.content-clip-box {
		position: absolute;
		inset: 0;
		/* Using overflow: hidden will try to move clipped text elements into the bounds all the time: */
		clip-path: border-box;
	}

	/* We can't transform the parent, because these must be in different stacking contexts: */
	.content, .controls, .origin-drag-handle {
		position: absolute;
		left: var(--origin-x);
		top: var(--origin-y);
		width: var(--size-x);
		height: var(--size-y);
	}

	.content, .origin-drag-handle {
		transform: translate(-50%, -50%) rotate(var(--angle));
	}

	.origin-drag-handle {
		pointer-events: auto;
		cursor: move;
	}

	.content {
		padding: var(--padding);

		& > :global(*) {
			pointer-events: auto;
		}
	}

	.controls {
		transform: translate(-50%, -50%);

		z-index: 1;
	}

	.controls-rotated {
		transform: rotate(var(--angle));

		position: absolute;
		inset: 0;
	}

	.control {
		position: absolute;

		pointer-events: auto;
	}

	.control.origin {
		inset: 0;
		pointer-events: none;

		&::before {
			content: '';
			position: absolute;
			inset: calc(var(--padding-half) - var(--border-thickness) / 2);
			border: var(--border-thickness) solid var(--c-accent);
			pointer-events: none;
		}
	}

	.control.angle {
		--length: 12px;
		--offset: 20px;
		width: var(--length);
		height: var(--length);

		background-color: var(--c-accent);
		border: 2px solid var(--c-white);
		border-radius: 50%;
		top: calc(var(--padding-half) - var(--offset) - var(--length));
		left: calc(50% - var(--length) / 2);

		display: flex;
		justify-content: center;

		cursor: grab;

		&::before {
			content: '';
			position: absolute;
			z-index: -1;
			top: 50%;
			background-color: var(--c-accent);
			width: 2px;
			height: calc(var(--length) / 2 + var(--offset));
		}
	}

	.control.size {
		--length: 12px;
		--inset: calc(var(--padding-half) - var(--length) / 2);
		width: var(--length);
		height: var(--length);
		background-color: var(--c-accent);
		border: 2px solid var(--c-white);

		&.n { top: var(--inset); left: 50%; transform: translateX(-50%); }
		&.e { top: 50%; right: var(--inset); transform: translateY(-50%); }
		&.s { bottom: var(--inset); left: 50%; transform: translateX(-50%); }
		&.w { top: 50%; left: var(--inset); transform: translateY(-50%); }
		&.ne { top: var(--inset); right: var(--inset); }
		&.nw { top: var(--inset); left: var(--inset); }
		&.se { bottom: var(--inset); right: var(--inset); }
		&.sw { bottom: var(--inset); left: var(--inset); }
	}

	.control.options {
		left: 50%;
		top: 50%;
		transform:
			translate(-50%, -100%)
			translateY(calc(var(--box-height) / -2))
			translateY(-40px);

		display: flex;
		background-color: var(--c-white);
		padding: 1em;
		border-radius: 4px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
		gap: 0.5em;

		.dragging-angle & {
			transition: transform ease 100ms;
		}
	}

	.dragging .control,
	.dragging .origin-drag-handle {
		cursor: inherit;
	}

	.transformable:not(.selected) {
		overflow: hidden;

		.control {
			display: none;
		}
	}
</style>
