import type { COLORS } from "../types.js";

/**
 * This function takes an array of strings and returns and object with the rgbString values converted into INT8 (0-255)
 *
 * @param {Array} rgb - rgbString color as Array of strings
 *
 * @return {Object} an object that contains the r, g and b values as INT8
 */
export function fromRgb([r = 0, g = 0, b = 0, alpha = 1]: (
	| string
	| number
)[]): COLORS {
	// use the channel key as the new array key
	return {
		r: Number(r),
		g: Number(g),
		b: Number(b),
		A: Number(alpha),
	};
}
