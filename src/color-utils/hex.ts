import type { RGBA } from "../types.js";

/**
 * Converts a Hex color to rgbString
 *
 * @param {string} hex a tuple of hex values
 *
 * @return {string} the rgbString color values for the given hex color
 */
export function fromHex(hex: string[]): RGBA {
	// Extract the RGBA values from the hex values
	return {
		r: Number.parseInt(hex[0], 16),
		g: Number.parseInt(hex[1], 16),
		b: Number.parseInt(hex[2], 16),
		A: Number.parseInt(hex[3], 16) / 255 || 1,
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
