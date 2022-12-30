let uid = 0;
// Returns a numeric id unique to this project only.
export const getUID = () => uid++;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const snap = (value, step) => Math.round(value / step) * step;
