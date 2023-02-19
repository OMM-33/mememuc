<span class="loading">
	<span class="anim" />
	<span class="content">
		<slot />
	</span>
</span>

<style>
	.loading {
		position: relative;
	}

	.content {
		position: relative;
		z-index: 1;
	}

	.anim {
		--padding: calc(50% + 2em);
		--size: calc(100% + var(--padding) * 2);

		position: absolute;
		top: 50%;
		left: calc(var(--padding) * -1);
		width: var(--size);
		padding-top: var(--size);
		transform: translateY(-50%);
	}
	.anim::after,
	.anim::before {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background-color: hsl(var(--c-accent-hsl), 0.25);
		animation: loading-anim 2s ease-in-out infinite;
	}
	.anim::after {
		animation-delay: -1s;
	}

	@keyframes loading-anim {
		0%, 100% {
			transform: scale(0.5);
			opacity: 1;
		}
		50% {
			transform: scale(1);
			opacity: 0;
		}
	}
</style>
