import Media from "./Media";

import { arrayMove } from "../util";
import { buildURL, jsonHeaders } from "../api";

export const privacyLevels = [
	{ id: "public", label: "Public", icon:"🌐", description: "Post to public overview" },
	{ id: "unlisted", label: "Unlisted", icon:"🔓", description: "Do not post to public overview" },
	{ id: "private", label: "Private (Draft)", icon:"🔒", description: "Can only be viewed by you" },
];

export default class Meme extends Media {
	constructor({
		id, src, blob, width, height, updateDate,
		title = "",
		description = "",
		privacy = "public",
		views = 0,
		score = 0,
		vote = 0,
		comments = [],
		background = { media: null, color: "#ffffff" },
		layers = [],
	} = {}) {
		super({ id, src, blob, width, height, updateDate });

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
		/** @type {-1 | 0 | 1} */
		this.vote = vote;
		/**@type {array} */
		this.comments = comments;

		this.background = background;
		this.layers = layers.map((layer, index) => ({ ...layer, id: index }));
		/** @type {number} */
		this.nextLayerID = this.layers.length;
	}

	addLayer(type, data) {
		const layer = {
			text: () => ({
				origin: [0.5, 0.5], angle: 0, size: [0.75, 0.25],
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

	/** @param {-1 | 0 | 1} vote */
	toggleVote(vote) {
		const prevVote = this.vote;
		if (prevVote === vote) this.vote = 0;
		else this.vote = (vote >= 0) ? 1 : -1;

		this.score += this.vote - prevVote;
		this.notify();
	}

	/**
	 * Parses the serverside JSON representation to a Meme object.
	 * @override
	 **/
	static fromJSON(json) {
		const props = {
			...json,
			id: json._id,
			src: json.mediaURL,
			background: {
				color: json.background.color,
				media: json.background.mediaSource
					? new Media({ id: json.background.mediaSource.slice(-24), src: json.background.mediaSource })
					: null,
			},
			layers: json.layers.map(layer => {
				delete layer._id;
				layer.type = layer.layerType;
				delete layer.layerType;

				layer.origin = [layer.origin.x, layer.origin.y];
				layer.size = [layer.scale.x, layer.scale.y];
				delete layer.scale;
				layer.angle = layer.rotation;
				delete layer.rotation;

				if (layer.options.mediaSource) {
					layer.options.media = new Media({ id: layer.options.mediaSource.slice(-24), src: layer.options.mediaSource });
					delete layer.options.mediaSource;
				}

				return layer;
			}),
			updateDate: new Date(json.updateDate),
		};
		return new this(props);
	}

	/**
	 * GETs and returns a list of all meme objects.
	 *
	 * When an `id` is provided it instead returns that specific meme.
	 * @param {{ id?: string }}
	 * @override
	 */
	static async get({ id } = {}) {
		if (id) {
			const res = await fetch(buildURL(`api/meme/${id}`));
			const memeJSON = await res.json();
			return Meme.fromJSON(memeJSON);
		}

		const res = await fetch(buildURL("api/meme/list"));
		const memesJSON = await res.json();
		return memesJSON.map(memeJSON => Meme.fromJSON(memeJSON));
	}

	/**
	 * Just as with Media objects, the rendered Meme blob will be POSTed as Media.
	 *
	 * The server then further records the Meme definition as JSON.
	 * @override
	 */
	async post() {
		await super.post({ isTemplate: false });

		const res = await fetch(buildURL("api/meme"), {
			headers: jsonHeaders,
			method: "POST",
			body: JSON.stringify(this),
		});
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);
	}

	/** PUT up a new version of the Meme. We assume the server deletes the old media. */
	async put() {
		await super.post({ isTemplate: false });

		if (!this.id) throw new Error(
			"Cannot PUT Meme as it has no id specified. Make sure it has been uploaded previously.",
		);
		const res = await fetch(buildURL(`api/meme/${this.id}`), {
			headers: jsonHeaders,
			method: "PUT",
			body: JSON.stringify(this),
		});
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);
	}

	/**
	 * DELETEs this Meme object off the server. We assume the server deletes the according media.
	 * @override
	 */
	async delete() {
		if (!this.id) throw new Error(
			"Cannot DELETE Meme as it has no id specified. Make sure it has been uploaded previously.",
		);
		const res = await fetch(buildURL(`api/meme/${this.id}`), { method: "DELETE" });
		return res.text();
	}
}
