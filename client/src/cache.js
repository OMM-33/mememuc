import { writable } from "svelte/store";

import Media from "./models/Media";
import Meme from "./models/Meme";
import { getPlaceholderText } from "./util";

/** @type {Map<string, Media>} */
const templatesDefault = new Map([
	"https://i.imgur.com/Yu7x5MV.jpeg",
	"https://i.imgur.com/MiECrGi.jpeg",
	"https://i.imgur.com/1ns9fsG.jpeg",
	"https://i.imgur.com/OQ2z11V.jpeg",
	"https://i.imgur.com/sIzQ1s9.jpeg",
	"https://i.imgur.com/32IxU4l.jpeg",
	"https://i.imgur.com/q2MbxIR.jpeg",
	"https://i.imgur.com/vdoRUMd.jpeg",
	"https://i.imgur.com/hPzefau.jpeg",
].map((src, index) => {
	const id = String(index);
	return [id, new Media({ id, src })];
}));
export const templates = writable(templatesDefault);

/** @type {Map<string, Meme>} */
const memesDefault = new Map([
	"https://i.imgur.com/T8Hhkur.jpeg",
	"https://i.imgur.com/Uschheg.jpeg",
	"https://i.imgur.com/Jvh1OQm.jpeg",
	"https://i.imgur.com/jlFgGpe.jpeg",
	"https://i.imgur.com/K6U0L3q.jpeg",
	"https://i.imgur.com/rFBiyeR.jpeg",
	"https://i.imgur.com/g81WFjQ.jpeg",
	"https://i.imgur.com/0LINzxs.jpeg",
	"https://i.imgur.com/xp4WKjC.jpeg",
].map((src, index) => {
	const id = String(index);
	return [id, new Meme({
		id,
		src,
		ransomItem: "ines",
		title: getPlaceholderText(3 + Math.floor(Math.random() * 7)),
		views: Math.floor(Math.random() * 250),
		score: Math.floor(Math.random() * 100),
		commentCount: Math.floor(Math.random() * 25),
		comments: [{ name:"Felix",text: getPlaceholderText(3 + Math.floor(Math.random() * 7)) }, { name:"Ines",text: getPlaceholderText(3 + Math.floor(Math.random() * 7)) }],
		description: getPlaceholderText(3 + Math.floor(Math.random() * 10)),
	})];
}));
export const memes = writable(memesDefault);
