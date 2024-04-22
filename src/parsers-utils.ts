import {
	cleanDefinition,
	isHex,
	shortHexToLongHex,
	splitValues,
} from "./common.js";
import type { HEXSTRING } from "./types.js";

/**
 * Get the hex value of the color and convert it to an Object of R G And B values (still in hex format)
 *
 * @param value the string that contains the color in hex format
 *
 * @return {string[]} an array of six digit hex values in a triplet of R G and B (HEXSTRING format)
 */
export function parseHex(value: HEXSTRING): string[] {
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
				console.warn(`Invalid Hex length in index ${index}: ${value}`);
			}
		});

		return hexArray;
	}

	console.warn(`Invalid Hex: ${value}`);
	return fallbackColor(hexArray);
}

/**
 * Get the values of the color string
 *
 * @param colorString - the color string
 * @return {string[]} the values of the hslString string
 */
export function extract(colorString: string): string[] {
	const colorValue = cleanDefinition(colorString);

	let values: string[] = splitValues(colorValue);

	if (values.length !== 3 && values.length !== 4) {
		values = fallbackColor(values);
	}

	return values;
}

/**
 * Returns an array of fallback HSL values with default values of "0" for each component.
 *
 * @param {string[]} color - An array of HSL values as strings.
 * @param {string} [err="Invalid color"] - An optional error message to log.
 * @return {string[]} An array of fallback HSL values with default values of "0" for each component.
 */
export function fallbackColor(
	color: string[],
	err = "Invalid color",
): string[] {
	console.warn(err);
	return [color[0] ?? "0", color[1] ?? "0", color[2] ?? "0"];
}
