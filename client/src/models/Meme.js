import Media from "./Media";

import { arrayMove, stripHTML } from "../util";
import { buildURL, jsonHeaders } from "../api";
import { tts } from "../speech";
import { user as userStore } from "../auth";

let user;
userStore.subscribe(value => user = value);

export const privacyLevels = {
	public: { id: "public", label: "Public", icon: "🌐", description: "Post to public overview" },
	unlisted: { id: "unlisted", label: "Unlisted", icon: "🔓", description: "Do not post to public overview" },
	private: { id: "private", label: "Private (Draft)", icon: "🔒", description: "Can only be viewed by you" },
};

export default class Meme extends Media {
	constructor({
		id, src, blob, width, height, updateDate,
		creatorID,
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

		/** @type {string?} */
		this.creatorID = creatorID;
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
		/**@type {{ id: string, creatorID: string, creatorName: string, creationDate: Date }} */
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
					html: "[text]",
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
	async toggleVote(vote) {
		const prevVote = this.vote;
		let newVote;
		if (prevVote === vote) newVote = 0;
		else newVote = (vote >= 0) ? 1 : -1;

		const res = await fetch(buildURL(`api/meme/${this.id}/vote`), {
			headers: jsonHeaders,
			method: "POST",
			body: JSON.stringify({ value: newVote }),
		});
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);

		this.vote = newVote;
		this.score += this.vote - prevVote;
		this.notify();
	}

	async addComment(text) {
		if (!this.id) throw new Error(
			"Cannot comment Meme as it has no id specified. Make sure it has been uploaded previously.",
		);

		const res = await fetch(buildURL(`api/meme/${this.id}/comment`), {
			headers: jsonHeaders,
			method: "POST",
			body: JSON.stringify({ content: text }),
		});
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);

		this.comments.push({
			creatorID: user.id, creatorName: user.name, creationDate: new Date(), content: text,
		});
		this.notify();
	}

	/** @param {"title" | "description" | "captions"} attribute */
	tts(attribute) {
		switch (attribute) {
			case "title":
				return tts(this.title);
			case "description":
				return tts(this.description);
			case "captions": {
				const captions = this.layers
					.filter(l => l.type === "text")
					.map(l => stripHTML(l.options.html.replaceAll("</div>", "\n")));
				if (captions.length === 0) tts("This meeme has no captions.");
				else captions.forEach(text => tts(text));
				return;
			}
		}
	}

	/**
	 * Parses the serverside JSON representation to a Meme object.
	 * This currently **modifies** the input JSON which is... let's say not optimal 🙃.
	 * @override
	 **/
	static fromJSON(json) {
		// console.log(json)
		const props = {
			...json,
			id: json._id,
			src: json.mediaURL,
			views: json.viewCount,
			vote: json.votes.filter(({ creatorID }) => creatorID === user.id)?.[0]?.value || 0,
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
			comments: json.comments.map(comment => {
				comment.creationDate = new Date(comment.creationDate);
				return comment;
			}),
			updateDate: new Date(json.updateDate),
		};
		return new this(props);
	}

	static async getCount({ publicOnly = true } = {}) {
		const res = await fetch(buildURL("api/meme/total", { useAuth: !publicOnly }));
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);

		return (await res.json()).totalMemes;
	}

	/**
	 * GETs and returns an array of all meme objects.
	 * @override
	 */
	static async getMultiple() {
		const res = await fetch(buildURL("api/meme/list"));
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.json().message}`);

		const memesJSON = await res.json();
		return memesJSON.map(memeJSON => Meme.fromJSON(memeJSON));
	}

	/**
	 * GETs and returns a specific meme object of the specific `id`
	 * (or a `random` one, or adjacent to the `id`).
	 * @param {{ id?: string, random?: boolean, adjacent?: "next" | "previous" }}
	 * @override
	 */
	static async get({ id, random = false, adjacent } = {}) {
		const url = random ? buildURL("api/meme/random") : buildURL(`api/meme/${id}/${adjacent ?? ""}`);
		const res = await fetch(url);
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);

		const memeJSON = await res.json();
		return Meme.fromJSON(memeJSON);
	}

	/**
	 * Just as with Media objects, the rendered Meme blob will be POSTed as Media.
	 *
	 * The server then further records the Meme definition as JSON.
	 * @override
	 */
	async post() {
		// For when a user starts creating a meme when not logged in,
		// we need to make sure all the used templates are uploaded:
		const offlineLayers = this.layers.filter(({ options }) => options?.media && !options.media.id);
		await Promise.all(offlineLayers.map(layer => layer.options.media.post()));

		await super.post({ isTemplate: false });

		const res = await fetch(buildURL("api/meme"), {
			headers: jsonHeaders,
			method: "POST",
			body: JSON.stringify(this),
		});
		if (!res.ok) throw new Error(`${res.status} (${res.statusText}): ${await res.text()}`);

		const { _id: id } = await res.json();
		this.id = id;
		this.notify();
	}

	/** PATCH a new version of the Meme. We assume the server deletes the old media. */
	async patch() {
		await super.post({ isTemplate: false });

		if (!this.id) throw new Error(
			"Cannot PATCH Meme as it has no id specified. Make sure it has been uploaded previously.",
		);
		const res = await fetch(buildURL(`api/meme/${this.id}`), {
			headers: jsonHeaders,
			method: "PATCH",
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
