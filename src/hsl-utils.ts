import {
	cleanDefinition,
	colorValueFallbacks,
	convertToInt8,
	normalizeDegrees,
	splitValues,
} from "./common.ts";
import type { HSL, HSLA, RGB, RGBA, RGBDEF } from "./types.ts";

export function fallbackHSL(
	hsl: string[],
	err = "Invalid hslString color",
): string[] {
	console.warn(err);
	return [hsl[0] ?? 0, hsl[1] ?? 0, hsl[2]];
}

/**
 * Get the values of the hslString string
 *
 * @param {string} hslAsString - the valid hslString color string
 * @return {string[]} the values of the hslString string
 */
export function parseHsl(hslAsString: string): string[] {
	const hslvalue = cleanDefinition(hslAsString);

	let hsl: string[] = splitValues(hslvalue);

	if (hsl.length !== 3 && hsl.length !== 4) {
		hsl = fallbackHSL(hsl);
	}
	return [hsl[0], hsl[1], hsl[2]];
}

/**
 * The error message for invalid angle
 * @param value - the invalid angle
 */
const angleError = (value: string): string =>
	`Invalid angle: ${value} - The none keyword is invalid in legacy color syntax `;

/**
 * This function takes an array of strings and returns and object with the hslString values converted into INT8 (0-255)
 *
 * @param {string[]} hsl - the hslString values to parse from string to int8 values
 *
 */
export function getHslValues(hsl: string[]): HSLA {
	return {
		h:
			colorValueFallbacks(hsl[0], angleError(hsl[0])) ||
			Math.round(normalizeDegrees(hsl[0])) ||
			0,
		s: colorValueFallbacks(hsl[1]) || convertToInt8(hsl[1], 100) || 0,
		l: colorValueFallbacks(hsl[2]) || convertToInt8(hsl[2], 100) || 0,
		a: colorValueFallbacks(hsl[3]) || 1,
	};
}

/**
 * Takes the hslString values and returns the rgbString values
 * @param c chroma
 * @param x X
 * @param h Y
 */
function getHue(c: number, x: number, h: number): [number, number, number] {
	if (h < 60) return [c, x, 0];
	if (h < 120) return [x, c, 0];
	if (h < 180) return [0, c, x];
	if (h < 240) return [0, x, c];
	if (h < 300) return [x, 0, c];
	return [c, 0, x];
}

/**
 * Given the hslString color it convert the color into RGBSTRING
 *
 * @param {string[]} hslColor the hslString value to parse
 * @return {Object} rgbString value
 */
export function fromHsl(hslColor: RGBDEF): RGBA {
	const hsl = getHslValues(hslColor);
	const s = hsl.s / 100;
	const l = hsl.l / 100;
	const a = hslColor[3] || 1;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((hsl.h / 60) % 2) - 1));
	const m = l - c / 2;

	let [r, g, b] = getHue(c, x, hsl.h);

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return { r, g, b, a };
}

/**
 * Given the RGBSTRING color it convert the color into hslString
 *
 * @param {number} r - red
 * @param {number} g - green
 * @param {number} b - blue
 * @param {number} a - alpha
 *
 * @return {Object} hslString value
 */
export function valuesToHsl({ r, g, b, a }: RGBA): HSLA {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	const cmin = Math.min(r, g, b);
	const cmax = Math.max(r, g, b);
	const delta = cmax - cmin;
	let h = 0;
	let s = 0;
	let l = 0;

	// Calculate hue
	if (delta === 0) {
		// No difference
		h = 0;
	} else if (cmax === r) {
		// Red is max
		h = ((g - b) / delta) % 6;
	} else if (cmax === g) {
		// Green is max
		h = (b - r) / delta + 2;
	} else {
		h = (r - g) / delta + 4;
	} // Blue is max

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) {
		h += 360;
	}

	// Calculate lightness
	l = (cmax + cmin) / 2;

	// Calculate saturation
	s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);

	return { h, s, l, a };
}

/**
 * Converts an hslString color object to a string representation.
 *
 * @param {Object} hsl - Object containing the hslString color values.
 * @param {number} hsl.h - The hue value of the color.
 * @param {number} hsl.s - The saturation value of the color.
 * @param {number} hsl.l - The lightness value of the color.
 * @return {string} The hslString color as a string.
 */
export function hslString(hsl: { h: number; s: number; l: number }): string {
	return `hsl(${hsl.h},${hsl.s}%,${hsl.l}%)`;
}
