import { writable } from "svelte/store";

/** @type {{ jwt?: string, id?: string, name?: string }} */
const loggedOutUser = { jwt: undefined, id: undefined, name: undefined };
export const user = writable(loggedOutUser);
const rawCachedUserData = localStorage.getItem("user-login-data");
if (rawCachedUserData) {
	loginUser({ ...JSON.parse(rawCachedUserData), skipWriteCache: true });
}

export function loginUser({ jwt, id, name, skipWriteCache = false } = {}) {
	if (!jwt || !id || !name) {
		console.error("Did not receive all required user data for login.");
		return;
	}

	const props = { jwt, id, name };
	user.set(props);

	if (skipWriteCache) return;
	try {
		localStorage.setItem("user-login-data", JSON.stringify(props));
	} catch (error) {
		console.error("Could not cache user login data.", error);
	}
}

export function logoutUser() {
	user.set(loggedOutUser);
	localStorage.removeItem("user-login-data");
}
