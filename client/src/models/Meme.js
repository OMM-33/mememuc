import Reactive from "./Reactive";

import { arrayMove } from "../util";

export default class Meme extends Reactive {
	constructor({ background, size, layers } = {}) {
		super();

		this.background = background || {
			image: null,
			color: "#ffffff",
		};
		this.size = size || [512, 512];
		this.nextLayerID = 0;
		this.layers = layers || [];
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
					src: data.src,
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
