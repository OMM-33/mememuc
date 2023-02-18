export const tts = text => {
	const utterance = new SpeechSynthesisUtterance(text);
	window.speechSynthesis.speak(utterance);
};
