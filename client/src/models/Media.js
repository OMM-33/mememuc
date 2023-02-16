import { getImageDimensions } from "../util";

import Reactive from "./Reactive";

export default class Media extends Reactive {
	constructor({ src, blob, width, height } = {}) {
		super();
		/** @type {string} */
		this.src = src || blob && URL.createObjectURL(blob);
		/** @type {Blob?} */
		this.blob = blob;
		/** @type {number} */
		this.width = width ?? 0;
		/** @type {number} */
		this.height = height ?? 0;

		if (width === undefined && height === undefined) {
			this.dimensions = this.computeDimensions();
		} else {
			this.dimensions = Promise.resolve([this.width, this.height]);
		}
	}

	async computeDimensions() {
		([this.width, this.height] = await getImageDimensions(this.src));
		return [this.width, this.height];
	}

	// Must call this when dealing with blobs, as the objectURL will otherwise leak memory.
	/** @param {Blob?} blob */
	updateBlob(blob) {
		this.blob = blob;
		if (this.src?.startsWith("blob:")) {
			URL.revokeObjectURL(this.src);
		}
		this.src = this.blob ? URL.createObjectURL(blob) : "";
		this.notify();
	}

	destroy() {
		this.updateBlob(null);
	}
}
