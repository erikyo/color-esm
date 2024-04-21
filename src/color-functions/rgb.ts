import {Int, range, safeInt} from "../common.ts";
import type {RGBA} from "../types.ts";

/**
 * This function takes an array of strings and returns and object with the rgbString values converted into INT8 (0-255)
 *
 * @param {Array} rgb - rgbString color as Array of strings
 *
 * @return {Object} an object that contains the r, g and b values as INT8
 */
export function fromRgb([r, g, b, alpha]: (string | number)[]): RGBA {
	// use the channel key as the new array key
	return {
		r: Int(r, { min: 0, max: 255 }) || 0,
		g: Int(g, { min: 0, max: 255 }) || 0,
		b: Int(b, { min: 0, max: 255 }) || 0,
		alpha: range(safeInt(alpha), 0, 1) || 100,
	};
}
