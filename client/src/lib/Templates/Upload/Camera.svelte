<script>
	import { onMount } from "svelte";
	import Button from "../../Button.svelte";

	export let onNew, onError;

	let videoEl;
	let stream;
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	const onSnapshot = async () => {
		canvas.width = videoEl.videoWidth;
		canvas.height = videoEl.videoHeight;
		context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
		try {
			const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg"));
			onNew({ blob });
		} catch (error) {
			onError(error);
		}
	};

	onMount(async () => {
		if (!navigator.mediaDevices.getUserMedia) {
			onError("Browser does not support camera streaming.");
			return;
		}

		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
			if (!videoEl) return; // unmounted by now...
			videoEl.srcObject = stream;
		} catch (error) {
			onError(error);
		}
	});
</script>

<div class="camera">
	<video bind:this={videoEl} autoplay />
	<Button on:click={onSnapshot} disabled={!stream}>Take snapshot</Button>
</div>

<style>
	.camera {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	video {
		min-height: 0;
	}
</style>
