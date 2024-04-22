import * as namedColors from "./named-colors.json";
import type { COLOR_INFO, COLOR_NAME, RGB, RGBA } from "./types.js";

/**
 * Given a color string, it returns the closest corresponding name of the color.
 * Uses the Euclidean distance formula to calculate the distance between colors in the RGBSTRING color space.
 *
 * @param {string} color - the color string you want to find the closest color name
 * @param {NAMED_COLOR[]} set - the color set that will be used to find the closest color
 *
 * @return {COLOR_INFO} the closest color name and rgbString value
 *
 * @example // Returns the closest color name and rgbString value given a css color string
 * closest('#f00'); // { name: 'red', color: 'rgbString(255,0,0)' }
 *
 * closest('#f00', undefined, {info:true}); // { name: 'red', color: 'rgbString(255,0,0)', hex: '#ff0000', hslString: 'hslString(0, 100%, 50%)', distance: 0 ) }
 */
export function closest(color: RGBA, set = namedColors): COLOR_INFO {
	let closestGap = Number.MAX_SAFE_INTEGER;
	const closestColor: Partial<COLOR_INFO> = {};

	const rgbColorValues = Object.values(color);

	// Find the closest color in the color set
	for (const i in set) {
		const gap = this.distance(rgbColorValues, set[i], true);
		if (gap < closestGap) {
			closestGap = gap;
			closestColor.name = i as COLOR_NAME;
			closestColor.color = [set[i][0], set[i][1], set[i][2]];
		}

		// Break if exact match found
		if (gap === 0) {
			break;
		}
	}

	return closestColor as COLOR_INFO;
}

/**
 * Compute the distance between the two RGBSTRING values
 * There are two modes:
 * fast = true -> the distance is calculated without using the Euclidean formula completely, it is reliable but its result is exponential
 * fast = false -> the distance is calculated with the Euclidean formula, its result is linear
 *
 * @param rgb1 - The RGBSTRING value of the first color to compare
 * @param rgb2 - The RGBSTRING value of the second color to compare
 * @param fast - If you want to calculate the distance without calculating the square root, the result will be exponential otherwise is linear
 *
 * @return {number} the distance between the two RGBSTRING values
 *
 * @example distance([10, 20, 30], [120, 120, 120]); // 173.78147196982766
 */
export function distance(rgb1: RGB, rgb2: RGB, fast = false): number {
	const [rDiff, gDiff, bDiff] = [
		rgb2[0] - rgb1[0],
		rgb2[1] - rgb1[1],
		rgb2[2] - rgb1[2],
	];
	const dist = rDiff * rDiff + gDiff * gDiff + bDiff * bDiff;
	return fast ? dist : Math.sqrt(dist);
}
