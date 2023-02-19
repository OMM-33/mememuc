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
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve([img.width, img.height]);
		img.onerror = reject;

		img.src = src;
	});
};

// When using this function, make sure it cannot be solved using URL.createObjectURL(file) instead.
export const blobToDataURL = async (blob) => {
	const reader = new FileReader();
	return new Promise((resolve, reject) => {
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error);
		reader.onabort = reject;

		reader.readAsDataURL(blob);
	});
};

/**
 * Compress an image to a JPEG with maximum file-size target via semi-smart trial and error.
 * @param {string} src valid image source
 * @param {number} bytes maximum file size
 * @param {string} type output MIME type
 * @param {number} qualityResolution step size of quality in-/decrease to find an adequate file-size
 * @returns {Promise<Blob>}
 **/
export const compressImage = async (src, bytes, type = "image/jpeg", qualityResolution = 0.01) => {
	const canvas = document.createElement("canvas");
	const context = canvas.getContext("2d");

	const img = await new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;

		img.src = src;
	});

	canvas.width = img.width;
	canvas.height = img.height;
	context.drawImage(img, 0, 0);

	const getBlobForQuality = quality => {
		return new Promise(resolve => canvas.toBlob(resolve, type, quality));
	};

	let quality = 0.5;
	let step = quality / 2;
	let blob;
	// First do a sort of binary search to find a roughly adequate quality.
	do {
		blob = await getBlobForQuality(quality);

		// TIL: https://twitter.com/mhevery/status/1626002464469323777
		quality += blob.size < bytes ? step : 0 - step;
		step /= 2;
	} while (step > qualityResolution);

	quality += step;

	// Search for an "exact" match along the resolution.
	do {
		blob = await getBlobForQuality(quality);
		quality -= qualityResolution;
	} while (blob.size > bytes && quality > qualityResolution);
	return blob;
};

export const mimeToFileType = mime => mime.split("/").at(-1).toUpperCase();

export const getPlaceholderText = wordCount => {
	const words = ["conductor", "edge", "train", "troop", "aisle", "recommendation", "credibility", "word", "guilt", "construct", "chop", "disco", "computing", "vegetarian", "law", "variant", "feedback", "scrape", "hole", "me", "metal", "lend", "personality", "cinema", "look", "category", "comfortable", "gem", "diplomatic", "discourage", "like", "embrace", "cater", "exchange", "muscle", "gas", "contempt", "show", "still", "tin", "week", "provision", "jet", "factor", "regard", "heart", "effective", "executive", "outlet", "girlfriend", "victory", "brake", "cathedral", "concert", "pair", "like", "wonder", "consider", "proportion", "crude", "admit", "form", "temperature", "advertising", "free", "medal", "chimney", "expect", "mushroom", "concede", "option", "poll", "discriminate", "board", "earthflax", "policy", "marble", "burial", "threat", "public", "sell", "affair", "implicit", "leader", "wait", "wood", "do", "graphic", "feather", "metal", "gun", "linear", "leadership", "chimpanzee", "salad", "pen", "reasonable", "attack", "directory", "infect"];
	const result = [];
	do {
		const slice = shuffleArray(words).slice(0, wordCount);
		result.push(...slice);
		wordCount -= slice.length;
	} while (wordCount > 0);
	return result.join(" ");
};

/** Shuffles an array **in place**. */
export const shuffleArray = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};
