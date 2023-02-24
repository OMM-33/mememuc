<script>
	import { onDestroy, onMount } from "svelte";
	import tippy from "tippy.js";

	import Button from "./Button.svelte";

	export let rootEl;

	// Experimental technology still...
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
	// const SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

	let recognition;
	let running = false;
	/** @type {Map<string, { element: Element, callback: () => void}> */
	const commands = new Map();
	let tippys = [];

	const clearTippys = () => {
		tippys.forEach(tippy => tippy.destroy());
		tippys = [];
	};

	/** @param {Element} el */
	const defaultCallback = el => {
		el.focus && el.focus();
		el.click && el.click();
	};

	const updateCommands = () => {
		commands.clear();
		clearTippys();

		const elements = [...document.querySelectorAll("[data-sc]")].filter(element => {
			// Filter out any elements that are clipped or overlapped by something else.
			const { left, top, width, height } = element.getBoundingClientRect();
			const topEl = document.elementFromPoint(left + width / 2, top + height / 2);
			return element.contains(topEl);
		});

		for (const element of elements) {
			const { sc: name, scDir: placement } = element.dataset;
			commands.set(name, { element, callback: defaultCallback });
			console.log(placement)

			tippys.push(tippy(element, {
				content: `“${name}”`,
				placement,
				hideOnClick: false,
				showOnCreate: true,
				trigger: "manual",
				animation: false,
			}));
		}

		// Providing a grammar probably doesn't do anything yet... Even though it's "implemented" in Chromium.
		if (SpeechGrammarList) {
			const grammar = "#JSGF V1.0; grammar keywords; public <keyword> = " + [...commands.keys()].join(" | ") + " ;";
			const grammars = new SpeechGrammarList();
			grammars.addFromString(grammar, 1.0);
			recognition.grammars = grammars;
		}
	};

	const observer = new MutationObserver(updateCommands);

	onMount(() => {
		if (!SpeechRecognition) return;

		recognition = new SpeechRecognition();
		recognition.continuous = true;
		recognition.lang = "en-US";
		recognition.interimResults = false;
		recognition.maxAlternatives = 10;

		recognition.onstart = () => {
			running = true;
			updateCommands();
			observer.observe(rootEl, {
				subtree: true, childList: true, attributes: true, attributeFilter: ["data-sc", "data-sc-dir"],
			});
		};
		recognition.onend = () => {
			running = false;
			observer.disconnect();
			clearTippys();
		};
		recognition.onresult = ({ results, resultIndex }) => {
			const result = results[resultIndex];
			for (const { transcript } of result) {
				const keyword = transcript.match(new RegExp([...commands.keys()].join("|")))?.[0];
				if (!keyword) continue;

				console.info("Voice command issued:", keyword);
				const command = commands.get(keyword);
				command.callback(command.element);
				break;
			}
		};
	});

	onDestroy(() => {
		observer.disconnect();
		clearTippys();
	});
</script>

{#if SpeechRecognition}
	<Button data-sc="cancel" on:click={() => running ? recognition.stop() : recognition.start()}>
		{running ? "🔴" : "🎙️"}
	</Button>
{/if}
