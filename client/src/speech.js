export const tts = (text, { lang = "en-US" } = {}) => {
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = lang;
	window.speechSynthesis.speak(utterance);
};
