import { getImageDimensions } from "../util";
import { buildURL } from "../api";

import Reactive from "./Reactive";

export default class Media extends Reactive {
	constructor({ id, src, blob, width, height, updateDate } = {}) {
		super();
		/** @type {string?} */
		this.id = id;
		/** @type {string?} */
		this.src = src || blob && URL.createObjectURL(blob);
		/** @type {Blob?} */
		this.blob = blob;
		/** @type {number} */
		this.width = width ?? 0;
		/** @type {number} */
		this.height = height ?? 0;
		/** @type {Date?} */
		this.updateDate = updateDate ?? new Date();

		if (width === undefined && height === undefined && this.src) {
			this.dimensions = this.computeDimensions();
		} else {
			this.dimensions = Promise.resolve([this.width, this.height]);
		}
	}

	async computeDimensions() {
		([this.width, this.height] = await getImageDimensions(this.src));
		this.notify();
		return [this.width, this.height];
	}

	/**
	 * Must call this when dealing with blobs, as the objectURL will otherwise leak memory.
	 * @param {Blob?} blob
	 **/
	updateBlob(blob) {
		this.blob = blob;
		if (this.src?.startsWith("blob:")) {
			URL.revokeObjectURL(this.src);
		}
		if (this.blob) this.src = URL.createObjectURL(blob);
		this.notify();
	}

	destroy() {
		this.updateBlob(null);
		this.notify();
	}

	/** Parses the serverside JSON representation to a Media object. */
	static fromJSON({ _id: id, mediaURL: src, uploadDate: updateDateISO }) {
		return new this({ id, src, updateDate: new Date(updateDateISO) });
	}

	/**
	 * GETs and returns a list of all media objects.
	 * When `templates` is set, **only** templates (`true`) or **only non-templates** (`false`) will be fetched.
	 *
	 * When an `id` is provided it instead returns that file as a blob.
	 * @param {{ templates?: boolean, id?: string }}
	 */
	static async get({ templates, id } = {}) {
		if (id) {
			const res = await fetch(buildURL(`api/media/${id}`));
			return await res.blob();
		}

		const url = buildURL("api/media/list");
		if (templates !== undefined && templates !== null) {
			url.searchParams.append("templates", String(templates));
		}
		const res = await fetch(url);
		const mediasJSON = await res.json();
		return mediasJSON.map(mediaJSON => Media.fromJSON(mediaJSON));
	}

	/**
	 * Using the current blob, the Media is POSTed.
	 * The id & src will be updated to the server's response.
	 */
	async post({ isTemplate = false } = {}) {
		if (!this.blob) throw new Error("Cannot POST Media without a blob.");

		const formData = new FormData();
		formData.append("mediaFile", this.blob);
		formData.append("isTemplate", isTemplate);
		const res = await fetch(buildURL("api/media"), {
			method: "POST",
			body: formData,
		});
		if (!res.ok) throw new Error(`${res.status} (${res.statusText})`);

		const { mediaID: id, mediaURL: src } = await res.json();
		this.id = id;
		this.src = src;
		this.notify();
	}

	/** DELETEs this Media object off the server. */
	async delete() {
		if (!this.id) throw new Error(
			"Cannot DELETE Media as it has no id specified. Make sure it has been uploaded previously.",
		);
		const res = await fetch(buildURL(`api/media/${this.id}`), { method: "DELETE" });
		return res.text();
	}
}
