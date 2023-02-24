import { user as userStore } from "./auth";

let user;
userStore.subscribe(value => user = value);

export const buildURL = (url, { useAuth = true } = {}) => {
	const resultURL = new URL(url, import.meta.env.VITE_SERVER_URL);
	if (useAuth && user.jwt) resultURL.searchParams.append("jwt", user.jwt);
	return resultURL;
};

export const jsonHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
};
