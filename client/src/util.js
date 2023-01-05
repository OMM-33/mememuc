let uid = 0;
// Returns a numeric id unique to this project only.
export const getUID = () => uid++;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const snap = (value, step) => Math.round(value / step) * step;

export const arrayMove = (array, from, to) => {
	const item = array.splice(from, 1)[0];
	array.splice(to, 0, item);
};
