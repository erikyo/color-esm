import {
	cleanDefinition,
	convertToInt8,
	range,
	splitValues,
} from "./common.ts";
import type { RGB } from "./types.ts";

export function fallbackRGB(
	rgb: string[],
	err = "Invalid RGBSTRING color",
): string[] {
	console.warn(err);
	return [rgb[0] ?? "0", rgb[1] ?? "0", rgb[2] ?? "0"];
}

/**
 * Get the values of the rgbString string
 *
 * @param rgbAsString - the rgbString color as string split into values
 *
 * @return {Array} the values of the rgbString string as Array of strings that represent the rgbString color
 */
export function parseRgb(rgbAsString: string): string[] {
	const rgbvalue = cleanDefinition(rgbAsString);

	const rgb: string[] = splitValues(rgbvalue);

	if (rgb.length !== 3 && rgb.length !== 4) {
		return fallbackRGB(
			rgb,
			`Too few values to define rgb: ${rgbAsString} -> ${rgbvalue}`,
		);
	}
	return [rgb[0], rgb[1], rgb[2]];
}

/**
 * This function takes an array of strings and returns and object with the rgbString values converted into INT8 (0-255)
 *
 * @param {Array} rgb - rgbString color as Array of strings
 *
 * @return {Object} an object that contains the r, g and b values as INT8
 */
export function getRgbValues(rgb: string[]): RGBA {
	// use the channel key as the new array key
	return {
		r: range(Math.round(convertToInt8(rgb[0])), 0, 255) || 0,
		g: range(Math.round(convertToInt8(rgb[1])), 0, 255) || 0,
		b: range(Math.round(convertToInt8(rgb[2])), 0, 255) || 0,
		a: range(Math.round(convertToInt8(rgb[3])), 0, 1) || 100,
	};
}

/**
 * returns a string representation of the rgbString values
 *
 * @param {Object} rgb the rgbString color object
 * @param {string} sep the separator between the rgbString values
 * @return {string} a string representation of the rgbString values
 */
export function rgbString(rgb: RGB, sep = " "): string {
	return `rgb(${rgb.r + sep + rgb.g + sep + rgb.b})`;
}
