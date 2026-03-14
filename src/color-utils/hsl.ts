import { colorValueFallbacks, normalizeDegrees, safeInt } from "../common.js";
import type { HSL, HSLA, RGB } from "../types.js";

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
export function fromHsl([h, s, l, A]: string[]): HSLA {
	// Try to parse hue as a number first
	let hue = 0;
	if (h && !isNaN(Number(h))) {
		hue = normalizeDegrees(h);
	} else {
		hue = colorValueFallbacks(h, angleError(h)) || 0;
	}
	
	return {
		h: hue,
		s: safeInt(s, 100) || 0,
		l: safeInt(l, 100) || 0,
		A: A !== undefined ? Number(A) : 1,
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
 * Given the RGBSTRING color it convert the color into hslString
 *
 *
 * @return {Object} hslString value
 * @param rgb
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
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

	return { h, s, l };
}

/**
 * Given the hslString color it convert the color into RGBSTRING
 *
 * @param colorSet the hslString value to parse
 * @return The RGBA Object
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
	s = s / 100;
	l = l / 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let [r, g, b] = getHue(c, x, h);

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return { r, g, b };
}
