import { writable } from "svelte/store";

export default class Reactive {
	#store = writable(this);

	// Expose store's methods on our class instances:
	subscribe(run, invalidate) {
		return this.#store.subscribe(run, invalidate);
	}
	set(value) {
		return this.#store.set(value);
	}
	update(updater) {
		return this.#store.update(updater);
	}

	// Notify the underlying svelte store that data has been changed.
	// Needs to be called every time we change (public) fields.
	notify() {
		this.#store.set(this);
	}
}
