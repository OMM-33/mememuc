import { writable } from "svelte/store";

import Media from "./models/Media";
import Meme from "./models/Meme";

/** @type {Map<string, Media>} */
const templatesDefault = new Map();
export const templates = writable(templatesDefault);
let localTemplateID = 0;
export const getNextLocalTemplateID = () => localTemplateID++;

/** @type {Map<string, Meme>} */
const memesDefault = new Map();
export const memes = writable(memesDefault);

export const localEditorMeme = writable(new Meme({ width: 512, height: 512 }));

export const updateTemplates = async () => {
	const newTemplates = await Media.get({ templates: true });
	templates.set(new Map(newTemplates.map(media => [media.id, media])));
};

export const updateMemes = async () => {
	const newMemes = await Meme.getMultiple();
	memes.set(new Map(newMemes.map(meme => [meme.id, meme])));
};

export const resetEditorMeme = () => {
	localEditorMeme.set(new Meme({ width: 512, height: 512 }));
};
