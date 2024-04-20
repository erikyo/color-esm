import { fallbackRGB } from "./rgb-utils.ts";
import type { COLORSTRING, HEXSTRING, RGB, RGBA } from "./types.ts";

/**
 * It returns an object with the hex values of the 3 digit hex color
 *
 * @param {string} value 3 digit hex
 * @return {string[]} 6 digit hex
 */
export function shortHexToLongHex(value: string): string[] {
	// split the string in to an array of digits then return an array that contains that digit doubled for each item
	return Array.from(value).map((v: string) => (v + v).toUpperCase());
}

/**
 * Checks if a given string represents a hexadecimal number.
 *
 * @param {string} num - The string to be checked.
 * @return {boolean} Returns true if the string is a valid hexadecimal number, false otherwise.
 */
export function isHex(num: string): boolean {
	return Boolean(num.match(/^[0-9a-f]+$/i));
}

/**
 * Get the hex value of the color and convert it to an Object of R G And B values (still in hex format)
 *
 * @param value the string that contains the color in hex format
 *
 * @return {string[]} an array of 6 digit hex values in a triplet of R G and B (HEXSTRING format)
 */
export function parseHex(value: COLORSTRING): string[] {
	// remove # at the beginning of the hex color
	const hexColor: string = value.substring(1);

	/**
	 * then if the number of digits is greater than 2 (so it's something like 123 or abc456)
	 * breakdown the string into an object that contains the r g and b values in hex
	 */
	let hexArray: string[] = [];
	if (hexColor) {
		if (hexColor.length === 3 || hexColor.length === 4) {
			hexArray = shortHexToLongHex(hexColor);
		} else if (hexColor.length === 6 || hexColor.length === 8) {
			// match the hex value in groups of 2
			hexArray = (hexColor.match(/../g) || []).map((value: string) => value);
		}
	}

	if (hexArray.length) {
		hexArray?.forEach((value, index) => {
			if (isHex(value)) {
				hexArray[index] = value.toUpperCase();
			} else {
				console.warn(`Invalid Hex value: ${value}`);
			}
		});

		return hexArray;
	}

	console.warn(`Invalid Hex: ${value}`);
	return fallbackRGB(hexArray);
}

/**
 * Converts a Hex color to rgbString
 *
 * @param {string} hex a tuple of hex values
 *
 * @return {string} the rgbString color values for the given hex color
 */
export function fromHex(hex: string[] | number[]): RGBA {
	// Extract the RGBA values from the hex values
	return {
		r: Number.parseInt(hex[0], 16),
		g: Number.parseInt(hex[1], 16),
		b: Number.parseInt(hex[2], 16),
		a: Number.parseInt(hex[3], 16) / 255 || 1,
	};
}

/**
 * Convert a INT8 value to HEXSTRING
 *
 * @param {number} int8 - the integer value to convert
 *
 * @return {string} the hex string
 */
export function toHex(int8: number): string {
	return int8.toString(16).padStart(2, "0");
}

/**
 * Convert rgbString values to hex color
 *
 * @param {Object} rgb an object with the rgbString values
 *
 * @return {string} the hex string
 */
export function hexString(rgba: RGBA): HEXSTRING {
	// Extract the RGBSTRING values from the hex string
	return `#${
		toHex(rgba?.r) + toHex(rgba?.g) + toHex(rgba?.b) + toHex(rgba?.a)
	}`;
}
