import Media from "./Media";

import { arrayMove } from "../util";

export const privacyLevels = [
	{ id: "public", label: "Public", icon:"🌐", description: "Post to public overview" },
	{ id: "unlisted", label: "Unlisted", icon:"🔓", description: "Do not post to public overview" },
	{ id: "private", label: "Private (Draft)", icon:"🔒", description: "Can only be viewed by you" },
];

export default class Meme extends Media {
	constructor({
		id, src, blob, width, height,
		title = "",
		description = "",
		privacy = "public",
		views = 0,
		score = 0,
		commentCount = 0,
		background = { media: null, color: "#ffffff" },
		layers = [],
		comments =[],
	} = {}) {
		super({ id, src, blob, width, height });

		/** @type {string} */
		this.title = title;
		/** @type {string} */
		this.description = description;
		/** @type {"private" | "unlisted" | "public"} */
		this.privacy = privacy;
		/** @type {number} */
		this.views = views;
		/** @type {number} */
		this.score = score;
		/** @type {number} */
		this.commentCount = commentCount;

		this.background = background;
		this.layers = layers;
		/** @type {number} */
		this.nextLayerID = this.layers.length;

		/**@type {array} */
		this.comments = comments;
	}

	addLayer(type, data) {
		const layer = {
			text: () => ({
				origin: [0.5, 0.5], angle: 0, size: [0.5, 0.25],
				options: {
					text: "[text]",
					font: { size: 64, color: "#ffffff", colorStroke: "#000000", align: 1 },
				},
			}),
			image: () => ({
				origin: [0.5, 0.5], angle: 0, size: [0.33, 0.33],
				options: {
					media: data.media,
					fit: 0,
					flip: false,
				},
			}),
		}[type]();
		this.layers.push({ id: this.nextLayerID++, type, ...layer });
		this.notify();
	}

	moveLayer(index, moveBy) {
		const newIndex = index + moveBy;
		if (newIndex < 0 || newIndex >= this.layers.length) return;

		arrayMove(this.layers, index, newIndex);
		this.notify();
	}

	deleteLayer(index) {
		this.layers.splice(index, 1);
		this.nextLayerID--;
		this.notify();
	}

	duplicateLayer(index) {
		// Deep clone layer using JSON parsing for now...
		const layer = { ...JSON.parse(JSON.stringify(this.layers[index])), id: this.nextLayerID++ };
		this.layers.push(layer);
		this.notify();
	}

	clear() {
		this.layers = [];
		this.notify();
	}
}
