import { writable } from "svelte/store";

import Media from "./models/Media";

export const templates = writable([
	"https://i.imgur.com/Yu7x5MV.jpeg",
	"https://i.imgur.com/MiECrGi.jpeg",
	"https://i.imgur.com/1ns9fsG.jpeg",
	"https://i.imgur.com/OQ2z11V.jpeg",
	"https://i.imgur.com/sIzQ1s9.jpeg",
	"https://i.imgur.com/32IxU4l.jpeg",
	"https://i.imgur.com/q2MbxIR.jpeg",
	"https://i.imgur.com/vdoRUMd.jpeg",
	"https://i.imgur.com/hPzefau.jpeg",
].map(src => new Media({ src })));
