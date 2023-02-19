<script>
	import { createEventDispatcher } from "svelte";
	import Button from "./Button.svelte";

	export let value = undefined;
	export let valueAppend = undefined;

	const dispatch = createEventDispatcher();

	let running = false;
	let preSpeechValueAppend = "";

	// Experimental technology still...
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	// const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
	// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

	let recognition;

	(() => {
		if (!SpeechRecognition) return;

		recognition = new SpeechRecognition();
		recognition.continuous = false;
		recognition.interimResults = true;
		recognition.maxAlternatives = 1;

		recognition.onstart = () => {
			preSpeechValueAppend = valueAppend;
			dispatch("start");
			running = true;
		};
		recognition.onend = () => {
			dispatch("end");
			running = false;
		};
		recognition.onresult = ({ results }) => {
			const text = results[0][0].transcript;
			value = text;
			valueAppend = `${preSpeechValueAppend}${preSpeechValueAppend ? " " : ""}${text}`;
			dispatch("change", text);
		};
	})();
</script>

{#if SpeechRecognition}
	<Button on:click={() => running ? recognition.stop() : recognition.start()} {...$$restProps}>
		{running ? "🔴" : "🎙️"}
	</Button>
{/if}
