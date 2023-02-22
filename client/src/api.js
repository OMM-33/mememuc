export const buildURL = url => new URL(url, import.meta.env.VITE_SERVER_URL);

export const jsonHeaders = {
	"Accept": "application/json",
	"Content-Type": "application/json",
};
