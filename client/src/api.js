import { jwt as jwtStore } from "./auth";

let jwt;
jwtStore.subscribe(value => jwt = value);

export const buildURL = (url, { useAuth = true } = {}) => {
	const resultURL = new URL(url, import.meta.env.VITE_SERVER_URL);
	if (useAuth && jwt) resultURL.searchParams.append("jwt", jwt);
	return resultURL;
};

export const jsonHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
};
