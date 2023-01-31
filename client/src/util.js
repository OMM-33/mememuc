let uid = 0;
// Returns a numeric id unique to this project only.
export const getUID = () => uid++;

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const snap = (value, step) => Math.round(value / step) * step;

export const arrayMove = (array, from, to) => {
	const item = array.splice(from, 1)[0];
	array.splice(to, 0, item);
};

export const getImageDimensions = async (src) => {
	return new Promise(resolve => {
		const img = new Image();
		img.onload = () => resolve([img.width, img.height]);
		img.src = src;
	});
};
